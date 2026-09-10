const pool = require('./src/config/db');
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
  try {
    const password = await bcrypt.hash('password123', 10);
    const users = [
      ['Admin Klinik', 'admin@klinik.com', password, 'admin'],
      ['Dokter Umum', 'dokter@klinik.com', password, 'doctor'],
      ['Petugas Pendaftaran', 'petugas@klinik.com', password, 'receptionist']
    ];

    for (const user of users) {
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
        user
      );
    }
    console.log('✅ Seed users berhasil! Akun dibuat:');
    console.log('Admin    : admin@klinik.com / password123');
    console.log('Dokter   : dokter@klinik.com / password123');
    console.log('Petugas  : petugas@klinik.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Gagal seed:', error.message);
    process.exit(1);
  }
};

seedUsers();