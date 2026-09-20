import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AboutUs from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';
import Rooms from './pages/Rooms'
import RoomDetails from './pages/RoomDetails';
import Checkout from './pages/Checkout';
import BookingSuccess from './pages/BookingSuccess';
import BookingVerify from './pages/BookingVerify';
import Register from './pages/Register';
import Login from './pages/Login';
import Settings from './pages/Settings';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* <Navbar /> */}

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/verify/:reference" element={<BookingVerify />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />

            <Route path="/admin" element={<h1>Admin Page Works</h1>} />
            {/* <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
            >
              <Route index element={<AdminDashboard />} />
            </Route> */}
          </Routes>

        </main>

        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;