import { col } from '../config/db.js';
import { ApiError, asyncHandler } from '../middleware/error.js';
import { escapeRegex, getPagination, getSort, nightsBetween, pageResult, toObjectId } from '../utils/helpers.js';

export const STATUSES = ['pending', 'confirmed', 'cancelled'];

export const bookingSchema = {
  stayId: { type: 'string', required: true, label: 'Stay' },
  checkIn: { type: 'date', required: true, label: 'Check-in date' },
  checkOut: { type: 'date', required: true, label: 'Check-out date' },
  guests: { type: 'number', required: true, label: 'Guests', int: true, min: 1, max: 20 },
  origin: { type: 'string', label: 'Origin', max: 60 },
};

export const statusSchema = { status: { type: 'string', required: true, label: 'Status', enum: STATUSES } };

export const createBooking = asyncHandler(async (req, res) => {
  const { stayId, checkIn, checkOut, guests, origin = '' } = req.valid;
  const stay = await col('stays').findOne({ _id: toObjectId(stayId, 'stay id') });
  if (!stay) throw new ApiError(404, 'Stay not found');

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const errors = {};
  if (checkIn < today) errors.checkIn = 'Check-in cannot be in the past';
  if (checkOut <= checkIn) errors.checkOut = 'Check-out must be after check-in';
  if (guests > stay.guests) errors.guests = `This stay fits up to ${stay.guests} guests`;
  if (Object.keys(errors).length) throw new ApiError(422, 'Please fix the highlighted fields', errors);

  const nights = nightsBetween(checkIn, checkOut);
  const booking = {
    userId: req.user._id,
    userName: `${req.user.firstName} ${req.user.lastName}`.trim(),
    stayId: stay._id,
    stayTitle: stay.title,
    stayImage: stay.images[0],
    destination: stay.location,
    origin,
    checkIn,
    checkOut,
    guests,
    nights,
    pricePerNight: stay.pricePerNight,
    total: nights * stay.pricePerNight,
    status: 'pending',
    createdAt: new Date(),
  };
  const { insertedId } = await col('bookings').insertOne(booking);
  res.status(201).json({ booking: { ...booking, _id: insertedId } });
});

/** Admins see every booking, regular users only their own. */
export const listBookings = asyncHandler(async (req, res) => {
  const pager = getPagination(req.query);
  const filter = req.user.role === 'admin' ? {} : { userId: req.user._id };
  if (STATUSES.includes(req.query.status)) filter.status = req.query.status;
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(String(req.query.q).slice(0, 60)), 'i');
    filter.$or = [{ stayTitle: rx }, { destination: rx }, { userName: rx }];
  }
  const sort = getSort(req.query, ['createdAt', 'checkIn', 'total', 'status', 'stayTitle']);
  const bookings = col('bookings');
  const [items, total] = await Promise.all([
    bookings.find(filter).sort(sort).skip(pager.skip).limit(pager.limit).toArray(),
    bookings.countDocuments(filter),
  ]);
  res.json(pageResult(items, total, pager));
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const _id = toObjectId(req.params.id, 'booking id');
  const booking = await col('bookings').findOne({ _id });
  if (!booking) throw new ApiError(404, 'Booking not found');

  const { status } = req.valid;
  const isOwner = booking.userId.equals(req.user._id);
  if (req.user.role !== 'admin' && !(isOwner && status === 'cancelled')) {
    throw new ApiError(403, 'You can only cancel your own bookings');
  }
  await col('bookings').updateOne({ _id }, { $set: { status, updatedAt: new Date() } });
  res.json({ message: `Booking ${status}` });
});

export const deleteBooking = asyncHandler(async (req, res) => {
  const { deletedCount } = await col('bookings').deleteOne({ _id: toObjectId(req.params.id, 'booking id') });
  if (!deletedCount) throw new ApiError(404, 'Booking not found');
  res.json({ message: 'Booking deleted' });
});
