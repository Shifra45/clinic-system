const router = require('express').Router();
const patientController = require('../controllers/patientController');
const { authenticate, authorize } = require('../middlewares/auth');

// Semua route di sini butuh autentikasi
router.use(authenticate);

// Hanya Admin dan Petugas yang boleh CRUD pasien
router.get('/', authorize('admin', 'receptionist', 'doctor'), patientController.getAllPatients);
router.get('/:id', authorize('admin', 'receptionist', 'doctor'), patientController.getPatientById);
router.post('/', authorize('admin', 'receptionist'), patientController.createPatient);
router.put('/:id', authorize('admin', 'receptionist'), patientController.updatePatient);
router.delete('/:id', authorize('admin'), patientController.deletePatient);

module.exports = router;