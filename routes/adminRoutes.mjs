import express from 'express';
import User from '../models/User.mjs';
import Property from '../models/Property.mjs';
import Booking from '../models/Booking.mjs';
import Review from '../models/Review.mjs';
import { protect, authorize } from '../middleware/auth.mjs';

const router = express.Router();

// Admin stats
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const availableProperties = await Property.countDocuments({ status: 'available' });
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();

    res.json({
      success: true,
      data: {
        totalProperties,
        availableProperties,
        totalUsers,
        totalBookings,
        totalReviews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users (admin only)
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find()
      .sort('-createdAt')
      .limit(20)
      .select('name email role phone university createdAt');

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all bookings (admin only)
router.get('/bookings', protect, authorize('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('property', 'title')
      .populate('student', 'name email')
      .populate('landlord', 'name email')
      .sort('-createdAt')
      .limit(20);

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
