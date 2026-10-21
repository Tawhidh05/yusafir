import { col } from '../config/db.js';
import { asyncHandler } from '../middleware/error.js';

export const publicStats = asyncHandler(async (_req, res) => {
  const [destinations, stays, users, bookings, rating] = await Promise.all([
    col('destinations').countDocuments(),
    col('stays').countDocuments(),
    col('users').countDocuments(),
    col('bookings').countDocuments(),
    col('stays').aggregate([{ $match: { ratingCount: { $gt: 0 } } }, { $group: { _id: null, avg: { $avg: '$ratingAvg' } } }]).toArray(),
  ]);
  res.json({ destinations, stays, users, bookings, averageRating: rating[0]?.avg ?? 0 });
});

const monthKey = (date) => `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;

/** Last six calendar months including the current one, so charts never have gaps. */
function lastSixMonths() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - i), 1)));
}

/** Overview cards + chart data. Admins see platform-wide numbers, users see their own bookings. */
export const dashboardStats = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const scope = isAdmin ? {} : { userId: req.user._id };
  const bookings = col('bookings');
  const active = { ...scope, status: { $ne: 'cancelled' } };
  const months = lastSixMonths();

  const [totals, byDestination, byStatus, monthly] = await Promise.all([
    bookings.aggregate([
      { $match: scope },
      { $group: {
        _id: null,
        bookings: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
        upcoming: { $sum: { $cond: [{ $and: [{ $ne: ['$status', 'cancelled'] }, { $gte: ['$checkIn', new Date()] }] }, 1, 0] } },
        revenue: { $sum: { $cond: [{ $ne: ['$status', 'cancelled'] }, '$total', 0] } },
      } },
    ]).toArray(),
    bookings.aggregate([{ $match: active }, { $group: { _id: '$destination', bookings: { $sum: 1 } } }, { $sort: { bookings: -1 } }, { $limit: 8 }]).toArray(),
    bookings.aggregate([{ $match: scope }, { $group: { _id: '$status', value: { $sum: 1 } } }]).toArray(),
    bookings.aggregate([
      { $match: { ...active, createdAt: { $gte: months[0] } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, bookings: { $sum: 1 }, amount: { $sum: '$total' } } },
    ]).toArray(),
  ]);

  const t = totals[0] || { bookings: 0, pending: 0, cancelled: 0, upcoming: 0, revenue: 0 };
  const monthlyMap = Object.fromEntries(monthly.map((m) => [m._id, m]));
  const trend = months.map((date) => ({
    month: date.toLocaleString('en', { month: 'short', timeZone: 'UTC' }),
    bookings: monthlyMap[monthKey(date)]?.bookings ?? 0,
    amount: monthlyMap[monthKey(date)]?.amount ?? 0,
  }));

  let cards;
  if (isAdmin) {
    const [users, stays, destinations] = await Promise.all([col('users').countDocuments(), col('stays').countDocuments(), col('destinations').countDocuments()]);
    cards = [
      { key: 'users', label: 'Total users', value: users },
      { key: 'stays', label: 'Total stays', value: stays },
      { key: 'destinations', label: 'Destinations', value: destinations },
      { key: 'bookings', label: 'Bookings', value: t.bookings },
      { key: 'pending', label: 'Pending bookings', value: t.pending },
      { key: 'revenue', label: 'Booking value', value: t.revenue, currency: true },
    ];
  } else {
    cards = [
      { key: 'bookings', label: 'My bookings', value: t.bookings },
      { key: 'upcoming', label: 'Upcoming trips', value: t.upcoming },
      { key: 'pending', label: 'Awaiting confirmation', value: t.pending },
      { key: 'revenue', label: 'Total booked', value: t.revenue, currency: true },
    ];
  }

  res.json({
    role: req.user.role,
    cards,
    charts: {
      byDestination: byDestination.map((d) => ({ name: d._id, bookings: d.bookings })),
      byStatus: byStatus.map((s) => ({ name: s._id, value: s.value })),
      trend,
    },
  });
});
