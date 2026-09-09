const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
// Tambahkan routes lain di sini (patientRoutes, queueRoutes, dll)

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
// app.use('/api/patients', patientRoutes); // TODO: Buat ini nanti

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

module.exports = app;