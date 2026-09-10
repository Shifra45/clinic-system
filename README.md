# 🏥 Mini Clinic Information System

Aplikasi web sederhana untuk mengelola pelayanan klinik pratama, mencakup manajemen pasien, pendaftaran kunjungan, antrean, dan pemeriksaan dokter (SOAP).

## 📚 Teknologi

| Komponen | Teknologi |
|---|---|
| Frontend | React.js (Vite) + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| Autentikasi | JSON Web Token (JWT) |
| Version Control | Git |

## 📁 Struktur Project
clinic-system/
├── backend/ # Source code Node.js
│ ├── src/
│ │ ├── config/ # Koneksi database
│ │ ├── controllers/ # Logika bisnis
│ │ ├── middlewares/ # Auth, Response helper
│ │ ├── routes/ # Definisi endpoint
│ │ ├── app.js # Setup Express
│ │ └── server.js # Entry point
│ ├── seed.js # Script seeding user
│ ├── .env.example # Contoh konfigurasi
│ └── package.json
├── frontend/ # Source code React.js
│ ├── src/
│ │ ├── components/ # Komponen reusable
│ │ ├── contexts/ # State global (Auth)
│ │ ├── pages/ # Halaman aplikasi
│ │ ├── services/ # Axios instance
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
├── database/
│ └── schema.sql # Skema database
└── README.md


## ⚙️ Prasyarat

Sebelum menjalankan aplikasi, pastikan sudah terinstall:

- **Node.js** (v18 atau lebih baru) — [Download](https://nodejs.org)
- **PostgreSQL** (v14 atau lebih baru) — [Download](https://www.postgresql.org/download/)
- **Git** — [Download](https://git-scm.com)
- **Postman** (opsional, untuk testing API) — [Download](https://www.postman.com/downloads/)

## 🚀 Cara Instalasi & Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/[username]/clinic-system.git
cd clinic-system

2. Setup Database
Buka pgAdmin (atau DBeaver), lalu buat database baru bernama clinic_db.

Buka Query Tool pada database tersebut.

Copy isi file database/schema.sql dan jalankan di Query Tool.

Atau via terminal:

bash
psql -U postgres -d clinic_db -f database/schema.sql
3. Setup Backend
bash
cd backend
npm install
Buat file .env di folder backend/ dengan isi berikut (sesuaikan dengan konfigurasi lokal):

env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=[password_postgres_kamu]
DB_NAME=clinic_db
DB_PORT=5432
PORT=5000
JWT_SECRET=[string_random_rahasia]
JWT_EXPIRES_IN=24h
Jalankan seed user (membuat akun admin, dokter, petugas):

bash
node seed.js
Jalankan backend:

bash
npm run dev
Backend akan berjalan di http://localhost:5000.

4. Setup Frontend
Buka terminal baru (biarkan backend tetap jalan), lalu:

bash
cd frontend
npm install
npm run dev
Frontend akan berjalan di http://localhost:5173.

5. Buka Aplikasi di Browser
Buka browser dan akses: http://localhost:5173

🔑 Akun Login Default
Role	Email	Password
Administrator	admin@klinik.com	password123
Dokter	dokter@klinik.com	password123
Petugas Pendaftaran	petugas@klinik.com	password123
⚠️ Segera ganti password setelah login pertama kali di lingkungan produksi.

🔌 Endpoint API
Authentication
POST /api/auth/login

POST /api/auth/logout

Patient
GET /api/patients

GET /api/patients/:id

POST /api/patients

PUT /api/patients/:id

DELETE /api/patients/:id

Registration
GET /api/registrations

POST /api/registrations

PUT /api/registrations/:id

Queue
GET /api/queues

POST /api/queues

PUT /api/queues/:id/call

PUT /api/queues/:id/status

Medical Record
POST /api/medical-records

GET /api/medical-records/:patientId

Prescription
POST /api/prescriptions

GET /api/prescriptions/:id

Dokumentasi lengkap tersedia dalam Postman Collection di folder postman/.

📝 Asumsi & Penyederhanaan
Nomor Rekam Medis di-generate otomatis dengan format RM-YYYY-XXXX (misal: RM-2026-0001).

Nomor antrean di-generate otomatis dengan format A001, A002, dst, reset setiap hari.

Password disimpan dalam bentuk hash bcrypt.

Logout dilakukan di sisi client (JWT stateless), token dihapus dari localStorage.

Satu pendaftaran (registration) menghasilkan satu antrean dan satu rekam medis.

👨‍💻 Author
[Nama Lengkap Kamu]
[NIM/Email/Kontak]

text

**Tips**: Jangan lupa ganti bagian `[username]`, `[password_postgres_kamu]`, `[string_random_rahasia]`, dan `[Nama Lengkap Kamu]` dengan datamu sendiri.

---

## 🌐 Bagian 2: Cara Menjalankan Semuanya di Browser

Ini panduan teknis untuk **membuka aplikasi seperti user sungguhan** (klik-klik di browser). Saya asumsikan backend dan database sudah siap.

### 🎯 Langkah 1: Siapkan Dua Terminal

Di VS Code, buka **dua terminal** berdampingan (atau dua tab terminal):

**Terminal 1 — Backend:**
```bash
cd E:\clinic-system\backend
npm run dev
Tunggu sampai muncul:

text
Server running on port 5000
Terminal 2 — Frontend:

bash
cd E:\clinic-system\frontend
npm run dev
Tunggu sampai muncul:

text
➜  Local:   http://localhost:5173/
PENTING: Jangan tutup kedua terminal ini selama kamu menggunakan aplikasi. Kalau salah satu tertutup, aplikasi akan mati (error "site can't be reached").

🎯 Langkah 2: Buka Browser
Buka Chrome/Edge/Firefox, ketik:

text
http://localhost:5173
Saat ini, kamu masih melihat "Halo Kawan! Frontend Berjalan! 🎉" karena kita belum mengganti isi App.jsx dengan halaman asli.

🎯 Langkah 3: Pasang Halaman Asli (LOGIN, Dashboard, CRUD Pasien, dll)
Sekarang kita ubah frontend menjadi aplikasi klinik sungguhan. Lakukan satu per satu:

A. Buat frontend/src/services/api.js (Axios instance)

javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
B. Buat frontend/src/contexts/AuthContext.js — pakai kode yang saya berikan di pesan sebelumnya (bagian "Langkah 1").

C. Buat frontend/src/components/ProtectedRoute.js — pakai kode yang sama di pesan sebelumnya.

D. Buat frontend/src/pages/Login.js — pakai kode sebelumnya.

E. Buat frontend/src/pages/PatientPage.js, RegistrationPage.js, QueuePage.js, ExaminationPage.js, DashboardPage.js — semuanya sudah saya kasih kodenya di pesan sebelumnya.

F. Update frontend/src/App.jsx — ganti isi sementara "Halo Kawan!" dengan kode routing lengkap yang saya berikan (yang berisi Navigation dan Routes).

🎯 Langkah 4: Restart Frontend
Setelah semua file di atas dibuat:

Di terminal frontend, tekan Ctrl + C untuk stop.

Jalankan lagi: npm run dev.

Refresh browser (Ctrl + F5).

Sekarang kamu akan melihat halaman Login yang rapi!

🎯 Langkah 5: Coba Login
Email: admin@klinik.com

Password: password123

Klik Login.

Kalau berhasil, kamu akan diarahkan ke Dashboard dengan statistik.

🎯 Langkah 6: Jelajahi Aplikasi
Setelah login sebagai admin:

Klik menu Pasien → lihat daftar, coba tambah/edit/hapus.

Klik menu Daftar → daftarkan pasien ke poli.

Klik menu Antrean → lihat nomor antrean, panggil pasien.

Logout, login sebagai dokter → menu Pemeriksaan muncul untuk input SOAP.