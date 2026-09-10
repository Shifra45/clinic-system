const router = require('express').Router();
const registrationController = require('../controllers/registrationController');
const { authenticate, authorize } = require('../middlewares/auth');

// Semua route di sini butuh autentikasi
router.use(authenticate);

// Endpoint untuk pendaftaran
router.get('/', authorize('admin', 'receptionist'), registrationController.getAllRegistrations);
router.post('/', authorize('admin', 'receptionist'), registrationController.createRegistration);
router.put('/:id', authorize('admin', 'receptionist'), registrationController.updateRegistration);

module.exports = router;