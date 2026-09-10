import { useState, useEffect } from 'react';
import api from '../services/api';

const QueuePage = () => {
  const [queues, setQueues] = useState([]);

  const fetchQueues = async () => {
    try {
      const res = await api.get('/queues');
      setQueues(res.data.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchQueues(); }, []);

  const callQueue = async (id) => {
    try { await api.put(`/queues/${id}/call`); fetchQueues(); }
    catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const markDone = async (id) => {
    try { await api.put(`/queues/${id}/status`, { status: 'done' }); fetchQueues(); }
    catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Antrean Hari Ini</h2>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">No Antrean</th>
            <th className="p-2">Pasien</th>
            <th className="p-2">Status</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {queues.map((q) => (
            <tr key={q.id} className="border-b">
              <td className="p-2 font-bold text-blue-700">{q.queue_number}</td>
              <td className="p-2">{q.patient_name}</td>
              <td className="p-2">{q.status}</td>
              <td className="p-2">
                {q.status === 'waiting' && (
                  <button onClick={() => callQueue(q.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded">Panggil</button>
                )}
                {q.status === 'called' && (
                  <button onClick={() => markDone(q.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded">Selesai</button>
                )}
              </td>
            </tr>
          ))}
          {queues.length === 0 && (
            <tr><td colSpan="4" className="text-center p-4 text-gray-500">Belum ada antrean hari ini</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QueuePage;