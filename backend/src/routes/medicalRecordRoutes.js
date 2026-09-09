const router = require('express').Router();
const mrController = require('../controllers/medicalRecordController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

// Hanya Dokter yang bisa input pemeriksaan
router.post('/', authorize('doctor'), mrController.createMedicalRecord);

// Admin, Dokter, dan Petugas bisa lihat riwayat pasien
router.get('/:patientId', authorize('admin', 'doctor', 'receptionist'), mrController.getMedicalRecordByPatient);

module.exports = router;