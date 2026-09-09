-- =============================================
-- MINI CLINIC INFORMATION SYSTEM - DATABASE SCHEMA
-- Versi: 1.0
-- =============================================

-- 1. Tabel Users (Admin, Dokter, Petugas Pendaftaran)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'doctor', 'receptionist')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Master Data Pasien
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    medical_record_no VARCHAR(20) UNIQUE NOT NULL, -- Diisi oleh backend (misal: RM-2026-0001)
    nik VARCHAR(16) UNIQUE NOT NULL,               -- Validasi tidak boleh duplikat
    name VARCHAR(100) NOT NULL,
    gender CHAR(1) NOT NULL CHECK (gender IN ('L', 'P')),
    birth_date DATE NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Pendaftaran Kunjungan
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES users(id) ON DELETE SET NULL, -- Dokter yang menangani
    poli VARCHAR(50) NOT NULL,                             -- Poli: Umum, Gigi, Anak
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('BPJS', 'Umum', 'Asuransi')),
    initial_complaint TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Menunggu' CHECK (status IN ('Menunggu', 'Check In', 'Pemeriksaan', 'Selesai')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Antrean (Generate Nomor Antrean)
CREATE TABLE queues (
    id SERIAL PRIMARY KEY,
    registration_id INT NOT NULL UNIQUE REFERENCES registrations(id) ON DELETE CASCADE, -- 1 Registrasi = 1 Antrean
    queue_number VARCHAR(5) NOT NULL, -- Contoh: A001, A002 (diisi oleh backend)
    status VARCHAR(20) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'called', 'done')),
    called_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Rekam Medis (SOAP)
CREATE TABLE medical_records (
    id SERIAL PRIMARY KEY,
    registration_id INT NOT NULL UNIQUE REFERENCES registrations(id) ON DELETE CASCADE, -- 1 Pendaftaran = 1 Rekam Medis
    subjective TEXT, -- Keluhan Pasien
    blood_pressure VARCHAR(10), -- Tekanan Darah
    temperature DECIMAL(5,2),   -- Suhu Tubuh
    weight DECIMAL(5,2),        -- Berat Badan
    height DECIMAL(5,2),        -- Tinggi Badan
    assessment TEXT,            -- Diagnosa
    plan TEXT,                  -- Rencana Terapi
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabel Resep Obat
CREATE TABLE prescriptions (
    id SERIAL PRIMARY KEY,
    medical_record_id INT NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
    drug_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(100),
    quantity VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabel Tindakan Medis
CREATE TABLE medical_actions (
    id SERIAL PRIMARY KEY,
    medical_record_id INT NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
    action_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- SEED DATA (Akun Login Awal)
-- Password di bawah adalah hash dari "password123" (menggunakan bcrypt)
-- Wajib ganti password ini setelah login di aplikasi!
-- =============================================
INSERT INTO users (name, email, password, role) VALUES 
('Admin Klinik', 'admin@klinik.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8d6SXlGz3Zf3G3F6yZ4mQhHwZJ9y', 'admin'),
('Dokter Umum', 'dokter@klinik.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8d6SXlGz3Zf3G3F6yZ4mQhHwZJ9y', 'doctor'),
('Petugas Pendaftaran', 'petugas@klinik.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8d6SXlGz3Zf3G3F6yZ4mQhHwZJ9y', 'receptionist');