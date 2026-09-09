const router = require('express').Router();
const queueController = require('../controllers/queueController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', queueController.getTodayQueues);
router.post('/', authorize('admin', 'receptionist'), queueController.createQueue);
router.put('/:id/call', authorize('admin', 'doctor'), queueController.callQueue);
router.put('/:id/status', authorize('admin', 'doctor'), queueController.updateQueueStatus);

module.exports = router;