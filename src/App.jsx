import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import MainLayout from './components/layout/MainLayout';
import RequireAuth from './components/layout/RequireAuth';

// Every page is its own chunk, so the first load only downloads what the visited route needs.
const Home = lazy(() => import('./pages/Home'));
const Booking = lazy(() => import('./pages/Booking'));
const Explore = lazy(() => import('./pages/Explore'));
const StayDetails = lazy(() => import('./pages/StayDetails'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Posts = lazy(() => import('./pages/Posts'));
const PostDetails = lazy(() => import('./pages/PostDetails'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Overview = lazy(() => import('./pages/dashboard/Overview'));
const Bookings = lazy(() => import('./pages/dashboard/Bookings'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const ManageUsers = lazy(() => import('./pages/dashboard/ManageUsers'));
const ManageDestinations = lazy(() => import('./pages/dashboard/ManageDestinations'));
const ManageStays = lazy(() => import('./pages/dashboard/ManageStays'));
const StayForm = lazy(() => import('./pages/dashboard/StayForm'));
const DestinationForm = lazy(() => import('./pages/dashboard/DestinationForm'));
const Messages = lazy(() => import('./pages/dashboard/Messages'));

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="booking/:slug" element={<Booking />} />
        <Route path="explore" element={<Explore />} />
        <Route path="stays/:id" element={<StayDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="news" element={<Posts category="news" />} />
        <Route path="blog" element={<Posts category="guide" />} />
        <Route path="blog/:slug" element={<PostDetails />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="dashboard" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
        <Route index element={<Overview />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route element={<RequireAuth roles={['admin']} />}>
          <Route path="users" element={<ManageUsers />} />
          <Route path="destinations" element={<ManageDestinations />} />
          <Route path="destinations/new" element={<DestinationForm />} />
          <Route path="destinations/:slug/edit" element={<DestinationForm />} />
          <Route path="stays" element={<ManageStays />} />
          <Route path="stays/new" element={<StayForm />} />
          <Route path="stays/:id/edit" element={<StayForm />} />
          <Route path="messages" element={<Messages />} />
        </Route>
      </Route>
    </Routes>
  );
}
