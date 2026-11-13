import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";

import Dashboard from "./pages/Dashboard/Dashboard";

import Members from "./pages/Members/Members";
import AddMember from "./pages/Members/AddMember/AddMember";
import MemberDetails from "./pages/Members/MemberDetails/MemberDetails";
import EditMember from "./pages/Members/EditMember/EditMember";

import Trainers from "./pages/Trainers/Trainers";
import AddTrainer from "./pages/Trainers/AddTrainer/AddTrainer";
import TrainerDetails from "./pages/Trainers/TrainerDetails/TrainerDetails";
import EditTrainer from "./pages/Trainers/EditTrainer/EditTrainer";

import Inquiries from "./pages/Inquiries/Inquiries";
import InquiryDetails from "./pages/Inquiries/InquiryDetails/InquiryDetails";

import AdminLogin from "./pages/AdminLogin/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Membership from "./pages/membership/Membership";
import AddMembership from "./pages/membership/AddMembership/AddMembership";
import EditMembership from "./pages/membership/EditMembership/EditMembership";

import Announcements from "./pages/Announcements/Announcements";

// Admin Layout
const AdminLayout = () => {
  return (
    <div>
      <Sidebar />

      <main style={{ marginLeft: "280px" }}>
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <>
      <Routes>
        {/* Public Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            {/* Dashboard */}
            <Route
              path="/admin/dashboard"
              element={<Dashboard />}
            />

            {/* Members */}
            <Route path="/admin/members" element={<Members />} />

            <Route
              path="/admin/members/add"
              element={<AddMember />}
            />

            <Route
              path="/admin/members/:id"
              element={<MemberDetails />}
            />

            <Route
              path="/admin/members/edit/:id"
              element={<EditMember />}
            />

            {/* Trainers */}
            <Route path="/admin/trainers" element={<Trainers />} />

            <Route
              path="/admin/trainers/add"
              element={<AddTrainer />}
            />

            <Route
              path="/admin/trainers/:id"
              element={<TrainerDetails />}
            />

            <Route
              path="/admin/trainers/edit/:id"
              element={<EditTrainer />}
            />

            {/* Inquiries */}
            <Route
              path="/admin/inquiries"
              element={<Inquiries />}
            />

            <Route
              path="/admin/inquiries/:id"
              element={<InquiryDetails />}
            />

            {/* Membership */}
            <Route
              path="/admin/membership"
              element={<Membership />}
            />

            <Route
              path="/admin/membership/add"
              element={<AddMembership />}
            />

            <Route
              path="/admin/membership/edit/:id"
              element={<EditMembership />}
            />


          <Route path="/admin/announcements" element={<Announcements />}/>
          </Route>
        </Route>

        {/* Default Redirect */}
        <Route
          path="/"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        {/* 404 Redirect */}
        <Route
          path="*"
          element={<Navigate to="/admin/dashboard" replace />}
        />
      </Routes>

      {/* React Toastify Container */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
};

export default App;