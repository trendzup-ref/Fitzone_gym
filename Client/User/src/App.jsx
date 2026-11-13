import { Routes, Route } from "react-router-dom";
import Navbar from "./components/home/Navbar";
import Home from "./pages/Home"; 
import About from "./pages/About";
import Program from "./pages/Program";
import Trainers from "./pages/Trainers";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
// import AdminLogin from "./pages/Admin/AdminLogin";
import Register from "./pages/MemberAuth/Register/Register";
import Login from "./pages/MemberAuth/Login/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/MemberAuth/Dashboard/Dashboard";
import Profile from "./pages/MemberAuth/Profile/Profile";
import EditProfile from "./pages/MemberAuth/EditProfile/EditProfile";
import Announcements from "./pages/MemberAuth/Announcements/Announcements";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Program />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/gallery" element={<Gallery />}/>
        <Route path="/contact" element={<Contact /> } /> 
         {/* <Route path="/login" element={<AdminLogin />} /> */}
         <Route path="/member/register" element={<Register />}/> 
         <Route path="/member/login" element={<Login /> } /> 
         <Route path="/member/dashboard" element={<Dashboard />}/>
         <Route path="/member/profile" element={<Profile />} />
         <Route path="/member/edit-profile" element={<EditProfile />} />
         <Route path="/member/announcements" element={<Announcements />} />
      </Routes>

      <ToastContainer
  position="top-right"
  autoClose={3000}
  theme="dark"
/>
    </>
  );
}

export default App;