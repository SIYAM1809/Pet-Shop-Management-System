import Pet from '../models/Pet.js';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import { asyncHandler } from '../middleware/error.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
    // Get counts
    const totalPets = await Pet.countDocuments();
    const availablePets = await Pet.countDocuments({ status: 'Available' });
    const totalCustomers = await Customer.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });

    // Get revenue
    const revenueResult = await Order.aggregate([
        { $match: { paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({
        createdAt: { $gte: today }
    });

    const todayRevenueResult = await Order.aggregate([
        { $match: { createdAt: { $gte: today }, paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const todayRevenue = todayRevenueResult[0]?.total || 0;

    // Get monthly revenue for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo }, paymentStatus: 'Paid' } },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                revenue: { $sum: '$totalAmount' },
                orders: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get pets by species for pie chart
    const petsBySpecies = await Pet.aggregate([
        { $group: { _id: '$species', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
        .populate('customer', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

    // Get recent pets
    const recentPets = await Pet.find()
        .sort({ createdAt: -1 })
        .limit(5);

    res.json({
        success: true,
        data: {
            stats: {
                totalPets,
                availablePets,
                totalCustomers,
                totalOrders,
                pendingOrders,
                totalRevenue,
                todayOrders,
                todayRevenue
            },
            charts: {
                monthlyRevenue: monthlyRevenue.map(item => ({
                    month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
                    revenue: item.revenue,
                    orders: item.orders
                })),
                petsBySpecies: petsBySpecies.map(item => ({
                    name: item._id,
                    value: item.count
                }))
            },
            recentOrders,
            recentPets
        }
    });
});
