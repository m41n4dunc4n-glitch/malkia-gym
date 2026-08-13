import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";

import ScrollToTop from "../components/common/ScrollToTop";

import RoleProtectedRoute from "../components/auth/RoleProtectedRoute";

/* Public Pages */
import Home from "../pages/Home";
import About from "../pages/About";
import Membership from "../pages/Membership";
import Trainers from "../pages/Trainers";
import Gallery from "../pages/Gallery";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

/* Member Pages */
import Member from "../pages/Member";
import Profile from "../pages/Profile";
import MemberMembership from "../pages/Member/Membership";
import MemberBookings from "../pages/Member/Bookings";
import MemberPayments from "../pages/Member/Payments";
import MemberPaymentHistory from "../pages/Member/Payment History";
import MemberFeedback from "../pages/Member/Feedback";
import History from "../pages/Member/History";
import MemberSettings from "../pages/Member/Settings";

/* Admin Pages */
import AdminDashboard from "../pages/Admin/Dashboard";
import Members from "../pages/Admin/Members";
import AdminBookings from "../pages/Admin/Bookings";
import AdminGallery from "../pages/Admin/Gallery";
import AdminPayments from "../pages/Admin/Payments";
import AdminTrainers from "../pages/Admin/Trainers";
import MembershipPlans from "../pages/Admin/MembershipPlans";
import AdminPaymentHistory from "../pages/Admin/Payment History";
import AdminHistory from "../pages/Admin/History";
import AdminFeedback from "../pages/Admin/Feedback";
import Reports from "../pages/Admin/Reports";
import AdminSettings from "../pages/Admin/Settings";

import Trainer from "../pages/Trainer";
import TrainerBookings from "../pages/Trainer/Bookings";
import TrainerProfile from "../pages/Trainer/Profile";
import TrainerLayout from "../layouts/TrainerLayout";

function AppRoutes() {
  return (
    <BrowserRouter>

      <ScrollToTop />

      <Routes>

        {/* =========================
              PUBLIC WEBSITE
        ========================== */}

        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/membership"
            element={<Membership />}
          />

          <Route
            path="/trainers"
            element={<Trainers />}
          />

          <Route
            path="/gallery"
            element={<Gallery />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

        </Route>

        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* =========================
              MEMBER DASHBOARD
        ========================== */}

        <Route
          element={
            <RoleProtectedRoute role="member">
              <DashboardLayout />
            </RoleProtectedRoute>
          }
        >

          <Route
            path="/member"
            element={<Member />}
          />

          <Route
            path="/member/profile"
            element={<Profile />}
          />

          <Route
            path="/member/membership"
            element={<MemberMembership />}
          />

          <Route
            path="/member/bookings"
            element={<MemberBookings />}
          />

          <Route
            path="/member/payments"
            element={<MemberPayments />}
          />

          <Route
            path="/member/payment-history"
            element={<MemberPaymentHistory />}
          />

          <Route
            path="/member/feedback"
            element={<MemberFeedback />}
          />

          <Route
            path="/member/history"
            element={<History />}
          />

          <Route
            path="/member/settings"
            element={<MemberSettings />}
          />

        </Route>


       {/* =========================
      TRAINER DASHBOARD
========================== */}

<Route
  element={
    <RoleProtectedRoute role="trainer">
      <TrainerLayout />
    </RoleProtectedRoute>
  }
>
  <Route
    path="/trainer"
    element={<Trainer />}
  />

  <Route
    path="/trainer/bookings"
    element={<TrainerBookings />}
  />

  <Route
    path="/trainer/profile"
    element={<TrainerProfile />}
  />
</Route>

        {/* =========================
              ADMIN DASHBOARD
        ========================== */}

        <Route
          element={
            <RoleProtectedRoute role="admin">
              <AdminLayout />
            </RoleProtectedRoute>
          }
        >

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/members"
            element={<Members />}
          />

          <Route
            path="/admin/bookings"
            element={<AdminBookings />}
          />

          <Route
            path="/admin/payments"
            element={<AdminPayments />}
          />

          <Route
            path="/admin/payment-history"
            element={<AdminPaymentHistory />}
          />

          <Route
            path="/admin/trainers"
            element={<AdminTrainers />}
          />

          <Route
            path="/admin/gallery"
            element={<AdminGallery />}
          />

          <Route
            path="/admin/plans"
            element={<MembershipPlans />}
          />

          <Route
            path="/admin/reports"
            element={<Reports />}
          />

          <Route
            path="/admin/history"
            element={<AdminHistory />}
          />

          <Route
            path="/admin/feedback"
            element={<AdminFeedback />}
          />

          <Route
            path="/admin/settings"
            element={<AdminSettings />}
          />

        </Route>

        {/* =========================
                 404 PAGE
        ========================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;