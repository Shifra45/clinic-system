const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const registrationRoutes = require('./routes/registrationRoutes'); // Perlu kamu buat
const queueRoutes = require('./routes/queueRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Daftarkan Route di sini
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/queues', queueRoutes);
app.use('/api/medical-records', medicalRecordRoutes);

// Route fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

module.exports = app;