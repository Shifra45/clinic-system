import { useState, useEffect } from 'react';
import api from '../services/api';

const RegistrationPage = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    patient_id: '', doctor_id: '', poli: '', visit_date: '',
    payment_type: '', initial_complaint: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/patients').then((res) => setPatients(res.data.data.data));
    setDoctors([{ id: 2, name: 'Dokter Umum' }]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/registrations', form);
      setMessage(`Berhasil! Nomor antrean: ${res.data.data.queue.queue_number}`);
      setForm({ patient_id: '', doctor_id: '', poli: '', visit_date: '', payment_type: '', initial_complaint: '' });
    } catch (e) {
      setMessage(e.response?.data?.message || 'Gagal mendaftar');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pendaftaran Pasien</h2>
      {message && <p className="bg-blue-100 text-blue-800 p-2 rounded mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <select className="w-full border p-2 rounded" value={form.patient_id}
          onChange={(e) => setForm({...form, patient_id: e.target.value})} required>
          <option value="">Pilih Pasien</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.medical_record_no})</option>
          ))}
        </select>

        <select className="w-full border p-2 rounded" value={form.doctor_id}
          onChange={(e) => setForm({...form, doctor_id: e.target.value})}>
          <option value="">Pilih Dokter</option>
          {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>

        <input className="w-full border p-2 rounded" placeholder="Poli (Umum/Gigi/Anak)"
          value={form.poli} onChange={(e) => setForm({...form, poli: e.target.value})} required />

        <input type="date" className="w-full border p-2 rounded" value={form.visit_date}
          onChange={(e) => setForm({...form, visit_date: e.target.value})} required />

        <select className="w-full border p-2 rounded" value={form.payment_type}
          onChange={(e) => setForm({...form, payment_type: e.target.value})} required>
          <option value="">Jenis Pembayaran</option>
          <option value="BPJS">BPJS</option>
          <option value="Umum">Umum</option>
          <option value="Asuransi">Asuransi</option>
        </select>

        <textarea className="w-full border p-2 rounded" placeholder="Keluhan Awal"
          value={form.initial_complaint} onChange={(e) => setForm({...form, initial_complaint: e.target.value})} />

        <button className="w-full bg-blue-600 text-white py-2 rounded">Daftarkan</button>
      </form>
    </div>
  );
};

export default RegistrationPage;