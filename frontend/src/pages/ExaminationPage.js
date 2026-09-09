import { useState } from 'react';
import api from '../services/api';

const ExaminationPage = () => {
  const [form, setForm] = useState({
    registration_id: '', subjective: '', blood_pressure: '', temperature: '', weight: '', height: '',
    assessment: '', plan: '', prescriptions: [], medical_actions: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/medical-records', form);
      alert('Pemeriksaan berhasil disimpan!');
      setForm({});
    } catch (e) { alert(e.response?.data?.message); }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pemeriksaan SOAP</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border p-2" placeholder="Registration ID" value={form.registration_id} onChange={e => setForm({...form, registration_id: e.target.value})} required />
        <textarea className="w-full border p-2" placeholder="Subjective (Keluhan)" value={form.subjective} onChange={e => setForm({...form, subjective: e.target.value})} />
        <input className="w-full border p-2" placeholder="Tensi (120/80)" value={form.blood_pressure} onChange={e => setForm({...form, blood_pressure: e.target.value})} />
        <input className="w-full border p-2" placeholder="Suhu" value={form.temperature} onChange={e => setForm({...form, temperature: e.target.value})} />
        <input className="w-full border p-2" placeholder="Berat Badan" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} />
        <input className="w-full border p-2" placeholder="Tinggi Badan" value={form.height} onChange={e => setForm({...form, height: e.target.value})} />
        <input className="w-full border p-2" placeholder="Assessment (Diagnosa)" value={form.assessment} onChange={e => setForm({...form, assessment: e.target.value})} />
        <textarea className="w-full border p-2" placeholder="Plan (Terapi)" value={form.plan} onChange={e => setForm({...form, plan: e.target.value})} />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Simpan Pemeriksaan</button>
      </form>
    </div>
  );
};

export default ExaminationPage;