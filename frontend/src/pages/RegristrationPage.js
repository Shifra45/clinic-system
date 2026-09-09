import { useState, useEffect } from 'react';
import api from '../services/api';

const RegistrationPage = () => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ patient_id: '', doctor_id: '', poli: '', visit_date: '', payment_type: '', initial_complaint: '' });

  useEffect(() => { api.get('/patients').then(res => setPatients(res.data.data.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/registrations', form);
      alert('Pendaftaran berhasil! Nomor antrean dibuat otomatis.');
      setForm({});
    } catch (e) { alert(e.response?.data?.message); }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pendaftaran Pasien</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <select className="w-full border p-2" value={form.patient_id} onChange={e => setForm({...form, patient_id: e.target.value})} required>
          <option value="">Pilih Pasien</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.medical_record_no})</option>)}
        </select>
        <input className="w-full border p-2" placeholder="ID Dokter (contoh: 2)" value={form.doctor_id} onChange={e => setForm({...form, doctor_id: e.target.value})} />
        <input className="w-full border p-2" placeholder="Poli (Umum, Gigi, Anak)" value={form.poli} onChange={e => setForm({...form, poli: e.target.value})} required />
        <input type="date" className="w-full border p-2" value={form.visit_date} onChange={e => setForm({...form, visit_date: e.target.value})} required />
        <select className="w-full border p-2" value={form.payment_type} onChange={e => setForm({...form, payment_type: e.target.value})} required>
          <option value="">Jenis Bayar</option><option value="BPJS">BPJS</option><option value="Umum">Umum</option><option value="Asuransi">Asuransi</option>
        </select>
        <textarea className="w-full border p-2" placeholder="Keluhan Awal" value={form.initial_complaint} onChange={e => setForm({...form, initial_complaint: e.target.value})} />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Daftarkan</button>
      </form>
    </div>
  );
};

export default RegistrationPage;