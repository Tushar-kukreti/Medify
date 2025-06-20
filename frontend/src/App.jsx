import About from "./components/About.jsx";
import Home from "./components/Home.jsx";
import SignUp from "./components/SignUp.jsx";
import LogIn from "./components/LogIn.jsx";
import MainHeader from "./components/MainHeader";
import NotFound from "./components/NotFound.jsx";
import DoctorDetails from './components/DoctorDetails.jsx'
import AllDoctors from "./components/AllDoctors.jsx";
import Contact from "./components/Contact.jsx";

import { Route, Routes} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, refreshAccessToken } from "./app/userSlice.js";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const { userInfo, isLoggedIn, loading } = useSelector((state) => state.user);

  useEffect(()=>{
    document.querySelector("html").classList.remove("light", "dark");
    document.querySelector("html").classList.add("light");
    const init_token = ()=>{
      const token = dispatch(refreshAccessToken());
      if (token) console.log("Access token refreshed:");
      else console.log("No token found, user might not be logged in.");
    };
    init_token();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  return (
    <div>      
      <AnimatePresence mode="wait">
        <Routes>
        <Route path="/" element = {<MainHeader/>}>
          <Route index element = {<Home/>}></Route>
          <Route path="*" element = {<NotFound/>}></Route>
          <Route path="/about" element = {<About/>}></Route>
          <Route path="/signup" element = {<SignUp/>}></Route>
          <Route path="/allDoctors" element = {<AllDoctors/>}></Route>
          <Route path="/contact" element = {<Contact/>}></Route>
          <Route path="/login" element = {<LogIn/>}></Route>
          <Route path="/doctor/:id" element={<DoctorDetails />} />
        </Route>
        </Routes>
      </AnimatePresence>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default App
