import { useState, useEffect } from 'react';
import api from '../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState({ total: 0, antrean: 0, waiting: 0, done: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const patientsRes = await api.get('/patients');
        const queuesRes = await api.get('/queues');
        const queues = queuesRes.data.data || [];
        setStats({
          total: patientsRes.data.data.pagination?.total || 0,
          antrean: queues.length,
          waiting: queues.filter((q) => q.status === 'waiting').length,
          done: queues.filter((q) => q.status === 'done').length,
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Klinik</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-3xl font-bold text-blue-700">{stats.total}</h3>
          <p className="text-gray-600">Total Pasien</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-3xl font-bold text-blue-700">{stats.antrean}</h3>
          <p className="text-gray-600">Antrean Hari Ini</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow text-center">
          <h3 className="text-3xl font-bold text-yellow-700">{stats.waiting}</h3>
          <p className="text-gray-600">Menunggu</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h3 className="text-3xl font-bold text-green-700">{stats.done}</h3>
          <p className="text-gray-600">Selesai</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;