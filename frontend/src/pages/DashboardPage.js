import { useState, useEffect } from 'react';
import api from '../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState({ patients: 0, patientsToday: 0, queuesToday: 0, waiting: 0, done: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const patientsRes = await api.get('/patients');
      const queuesRes = await api.get('/queues');
      
      const patients = patientsRes.data.data.data.length;
      const queues = queuesRes.data.data;
      
      setStats({
        patients,
        patientsToday: patients, // Asumsi semua pasien hari ini
        queuesToday: queues.length,
        waiting: queues.filter(q => q.status === 'waiting').length,
        done: queues.filter(q => q.status === 'done').length
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded shadow text-center"><h3 className="text-2xl font-bold">{stats.patients}</h3><p>Total Pasien</p></div>
      <div className="bg-white p-4 rounded shadow text-center"><h3 className="text-2xl font-bold">{stats.patientsToday}</h3><p>Pasien Hari Ini</p></div>
      <div className="bg-white p-4 rounded shadow text-center"><h3 className="text-2xl font-bold">{stats.queuesToday}</h3><p>Antrean Hari Ini</p></div>
      <div className="bg-yellow-100 p-4 rounded shadow text-center"><h3 className="text-2xl font-bold">{stats.waiting}</h3><p>Menunggu</p></div>
      <div className="bg-green-100 p-4 rounded shadow text-center"><h3 className="text-2xl font-bold">{stats.done}</h3><p>Selesai</p></div>
    </div>
  );
};

export default DashboardPage;