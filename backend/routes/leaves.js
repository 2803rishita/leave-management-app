const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  reviewLeave,
  getStats
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');

// Employee routes
router.post('/', protect, authorize('employee'), applyLeave);
router.get('/my', protect, authorize('employee'), getMyLeaves);

// Employer routes
router.get('/stats', protect, authorize('employer'), getStats);
router.get('/', protect, authorize('employer'), getAllLeaves);
router.patch('/:id/review', protect, authorize('employer'), reviewLeave);

module.exports = router;
