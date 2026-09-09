import { useState, useEffect } from 'react';
import api from '../services/api';

const QueuePage = () => {
  const [queues, setQueues] = useState([]);

  const fetchQueues = async () => {
    const res = await api.get('/queues');
    setQueues(res.data.data);
  };

  useEffect(() => { fetchQueues(); }, []);

  const callQueue = async (id) => {
    await api.put(`/queues/${id}/call`);
    fetchQueues();
  };

  const markDone = async (id) => {
    await api.put(`/queues/${id}/status`, { status: 'done' });
    fetchQueues();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Antrean Hari Ini</h2>
      <table className="w-full bg-white shadow rounded">
        <thead><tr className="bg-gray-100"><th>No Antrean</th><th>Pasien</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>
          {queues.map(q => (
            <tr key={q.id} className="border-b">
              <td className="p-2 font-bold">{q.queue_number}</td>
              <td>{q.patient_name}</td>
              <td>{q.status}</td>
              <td>
                {q.status === 'waiting' && <button onClick={() => callQueue(q.id)} className="bg-yellow-500 text-white px-3 py-1 rounded">Panggil</button>}
                {q.status === 'called' && <button onClick={() => markDone(q.id)} className="bg-green-600 text-white px-3 py-1 rounded">Selesai</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QueuePage;