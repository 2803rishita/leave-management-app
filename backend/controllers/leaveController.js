const Leave = require('../models/Leave');

// @desc    Apply for leave (Employee)
// @route   POST /api/leaves
// @access  Private (Employee)
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({ success: false, message: 'End date must be after start date.' });
    }

    const leave = await Leave.create({
      employee: req.user._id,
      leaveType,
      startDate: start,
      endDate: end,
      reason
    });

    await leave.populate('employee', 'name email department');

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully.',
      leave
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// @desc    Get employee's own leaves
// @route   GET /api/leaves/my
// @access  Private (Employee)
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id })
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: leaves.length, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Get all leaves (Employer)
// @route   GET /api/leaves
// @access  Private (Employer)
const getAllLeaves = async (req, res) => {
  try {
    const { status, leaveType } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (leaveType) filter.leaveType = leaveType;

    const leaves = await Leave.find(filter)
      .populate('employee', 'name email department')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: leaves.length, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Review leave request (Approve/Reject) - Employer
// @route   PATCH /api/leaves/:id/review
// @access  Private (Employer)
const reviewLeave = async (req, res) => {
  try {
    const { status, reviewNote } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be Approved or Rejected.' });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `This leave has already been ${leave.status.toLowerCase()}.`
      });
    }

    leave.status = status;
    leave.reviewedBy = req.user._id;
    leave.reviewNote = reviewNote || '';
    leave.reviewedAt = new Date();

    await leave.save();
    await leave.populate('employee', 'name email department');
    await leave.populate('reviewedBy', 'name email');

    res.json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully.`,
      leave
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Get leave stats (Employer)
// @route   GET /api/leaves/stats
// @access  Private (Employer)
const getStats = async (req, res) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      Leave.countDocuments(),
      Leave.countDocuments({ status: 'Pending' }),
      Leave.countDocuments({ status: 'Approved' }),
      Leave.countDocuments({ status: 'Rejected' })
    ]);

    res.json({ success: true, stats: { total, pending, approved, rejected } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, reviewLeave, getStats };
