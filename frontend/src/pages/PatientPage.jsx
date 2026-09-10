import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const PatientPage = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nik: '', name: '', gender: '', birth_date: '', phone: '', address: ''
  });

  const fetchPatients = async () => {
    try {
      const res = await api.get(`/patients?search=${search}&page=${page}&limit=10`);
      setPatients(res.data.data.data);
      setTotal(res.data.data.pagination.total);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchPatients(); }, [search, page]);

  const openAdd = () => {
    setEditing(null);
    setForm({ nik: '', name: '', gender: '', birth_date: '', phone: '', address: '' });
    setModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm(p);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/patients/${editing.id}`, form);
      else await api.post('/patients', form);
      setModal(false);
      fetchPatients();
    } catch (e) {
      alert(e.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin hapus pasien ini?')) {
      try {
        await api.delete(`/patients/${id}`);
        fetchPatients();
      } catch (e) {
        alert(e.response?.data?.message || 'Error');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <input
          className="border p-2 rounded w-1/3"
          placeholder="Cari nama atau NIK..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {(user.role === 'admin' || user.role === 'receptionist') && (
          <button onClick={openAdd} className="bg-green-600 text-white px-4 py-2 rounded">
            + Tambah Pasien
          </button>
        )}
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">No RM</th>
            <th className="p-2">Nama</th>
            <th className="p-2">NIK</th>
            <th className="p-2">JK</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.medical_record_no}</td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.nik}</td>
              <td className="p-2">{p.gender}</td>
              <td className="p-2">
                {(user.role === 'admin' || user.role === 'receptionist') && (
                  <>
                    <button onClick={() => openEdit(p)} className="text-blue-600 mr-2">Edit</button>
                    {user.role === 'admin' && (
                      <button onClick={() => handleDelete(p.id)} className="text-red-600">Hapus</button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
          {patients.length === 0 && (
            <tr><td colSpan="5" className="text-center p-4 text-gray-500">Belum ada data pasien</td></tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >Prev</button>
        <span className="px-4 py-2">Halaman {page}</span>
        <button
          disabled={page * 10 >= total}
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >Next</button>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form className="bg-white p-6 rounded w-96" onSubmit={handleSubmit}>
            <h3 className="text-lg font-bold mb-4">{editing ? 'Edit Pasien' : 'Tambah Pasien'}</h3>
            <input className="w-full border p-2 mb-2 rounded" placeholder="NIK (16 digit)"
              value={form.nik || ''} onChange={(e) => setForm({...form, nik: e.target.value})} required />
            <input className="w-full border p-2 mb-2 rounded" placeholder="Nama Lengkap"
              value={form.name || ''} onChange={(e) => setForm({...form, name: e.target.value})} required />
            <select className="w-full border p-2 mb-2 rounded" value={form.gender || ''}
              onChange={(e) => setForm({...form, gender: e.target.value})} required>
              <option value="">Pilih Jenis Kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
            <input type="date" className="w-full border p-2 mb-2 rounded"
              value={form.birth_date ? form.birth_date.slice(0,10) : ''}
              onChange={(e) => setForm({...form, birth_date: e.target.value})} required />
            <input className="w-full border p-2 mb-2 rounded" placeholder="No. Telepon"
              value={form.phone || ''} onChange={(e) => setForm({...form, phone: e.target.value})} />
            <textarea className="w-full border p-2 mb-2 rounded" placeholder="Alamat"
              value={form.address || ''} onChange={(e) => setForm({...form, address: e.target.value})} />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mb-2">Simpan</button>
            <button type="button" onClick={() => setModal(false)}
              className="w-full bg-gray-400 text-white py-2 rounded">Batal</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PatientPage;