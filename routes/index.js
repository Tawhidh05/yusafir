import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as auth from '../controllers/auth.controller.js';
import * as users from '../controllers/users.controller.js';
import * as destinations from '../controllers/destinations.controller.js';
import * as stays from '../controllers/stays.controller.js';
import * as bookings from '../controllers/bookings.controller.js';
import * as messages from '../controllers/messages.controller.js';
import * as posts from '../controllers/posts.controller.js';
import * as stats from '../controllers/stats.controller.js';

const router = Router();
const admin = [authenticate, authorize('admin')];

// Auth & profile
router.post('/auth/register', validate(auth.registerSchema), auth.register);
router.post('/auth/login', validate(auth.loginSchema), auth.login);
router.get('/auth/me', authenticate, auth.me);
router.put('/auth/me', authenticate, validate(auth.profileSchema), auth.updateMe);
router.put('/auth/password', authenticate, validate(auth.passwordSchema), auth.changePassword);

// Users (admin)
router.get('/users', ...admin, users.listUsers);
router.patch('/users/:id/role', ...admin, validate(users.roleSchema), users.updateUserRole);
router.delete('/users/:id', ...admin, users.deleteUser);

// Destinations
router.get('/destinations', destinations.listDestinations);
router.get('/destinations/categories', destinations.listCategories);
router.get('/destinations/:slug', destinations.getDestination);
router.post('/destinations', ...admin, validate(destinations.destinationSchema), destinations.createDestination);
router.put('/destinations/:slug', ...admin, validate(destinations.destinationSchema), destinations.updateDestination);
router.delete('/destinations/:slug', ...admin, destinations.deleteDestination);

// Stays & reviews
router.get('/stays', stays.listStays);
router.get('/stays/:id', stays.getStay);
router.post('/stays', ...admin, validate(stays.staySchema), stays.createStay);
router.put('/stays/:id', ...admin, validate(stays.staySchema), stays.updateStay);
router.delete('/stays/:id', ...admin, stays.deleteStay);
router.get('/stays/:id/reviews', stays.listReviews);
router.post('/stays/:id/reviews', authenticate, validate(stays.reviewSchema), stays.createReview);

// Bookings
router.post('/bookings', authenticate, validate(bookings.bookingSchema), bookings.createBooking);
router.get('/bookings', authenticate, bookings.listBookings);
router.patch('/bookings/:id/status', authenticate, validate(bookings.statusSchema), bookings.updateBookingStatus);
router.delete('/bookings/:id', ...admin, bookings.deleteBooking);

// Contact & newsletter
router.post('/messages', validate(messages.contactSchema), messages.createMessage);
router.get('/messages', ...admin, messages.listMessages);
router.delete('/messages/:id', ...admin, messages.deleteMessage);
router.post('/newsletter', validate(messages.newsletterSchema), messages.subscribe);

// Blog / news
router.get('/posts', posts.listPosts);
router.get('/posts/:slug', posts.getPost);

// Stats
router.get('/stats/public', stats.publicStats);
router.get('/stats/dashboard', authenticate, stats.dashboardStats);

export default router;
