import { useState } from 'react';
import api from '../services/api';

const ExaminationPage = () => {
  const [form, setForm] = useState({
    registration_id: '', subjective: '', blood_pressure: '', temperature: '',
    weight: '', height: '', assessment: '', plan: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/medical-records', {
        ...form,
        prescriptions: [],
        medical_actions: []
      });
      setMessage('Pemeriksaan berhasil disimpan!');
      setForm({ registration_id: '', subjective: '', blood_pressure: '', temperature: '',
        weight: '', height: '', assessment: '', plan: '' });
    } catch (e) {
      setMessage(e.response?.data?.message || 'Gagal menyimpan');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pemeriksaan SOAP</h2>
      {message && <p className="bg-blue-100 text-blue-800 p-2 rounded mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Registration ID"
          value={form.registration_id} onChange={(e) => setForm({...form, registration_id: e.target.value})} required />
        <textarea className="w-full border p-2 rounded" placeholder="Subjective (Keluhan)"
          value={form.subjective} onChange={(e) => setForm({...form, subjective: e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder="Tekanan Darah (120/80)"
          value={form.blood_pressure} onChange={(e) => setForm({...form, blood_pressure: e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder="Suhu Tubuh"
          value={form.temperature} onChange={(e) => setForm({...form, temperature: e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder="Berat Badan"
          value={form.weight} onChange={(e) => setForm({...form, weight: e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder="Tinggi Badan"
          value={form.height} onChange={(e) => setForm({...form, height: e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder="Assessment (Diagnosa)"
          value={form.assessment} onChange={(e) => setForm({...form, assessment: e.target.value})} />
        <textarea className="w-full border p-2 rounded" placeholder="Plan (Rencana Terapi)"
          value={form.plan} onChange={(e) => setForm({...form, plan: e.target.value})} />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Simpan Pemeriksaan</button>
      </form>
    </div>
  );
};

export default ExaminationPage;