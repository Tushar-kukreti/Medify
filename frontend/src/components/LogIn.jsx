import React, { useState } from "react";
import { motion } from "framer-motion";
import { doctor_banner1, doctor_banner2, doctor_banner3 } from "../assets/Doc/init";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../app/userSlice";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../app/userSlice";
import { toast } from 'react-toastify'

const doctorBanners = [doctor_banner1, doctor_banner2, doctor_banner3];

const LoginPage = () => {
  const [bannerId] = useState(Math.floor(Math.random() * doctorBanners.length));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      dispatch(loginUser({ email, password }))
        .unwrap()
        .then((data) => {
          localStorage.setItem("token", data.accessToken);
          dispatch(fetchUser());
          toast.success("Login Successfully", { position: "bottom-left" });
          navigate('/');
        })
        .catch((err) => {
          console.error("Login failed:", err);
          toast.error(msg || "Login failed", { position: "bottom-left" });
          setErrors({ general: "Login failed. Please try again." });
        });
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate("/signup", { state: { fromLogin: true } });
  };

  return (
    <motion.div
      className="min-h-screen w-full flex flex-col md:flex-row"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      {/* Form Section */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <input
                type="email"
                placeholder="Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <input
                type="password"
                placeholder="Password *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-bg_sky text-white py-2 rounded-xl hover:bg-bg_grey transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && <p className="text-red-500 text-center text-sm">{error}</p>}

            <div className="w-full text-center text-bg_grey font-semibold">
              Don’t have an account?
              <span className="text-bg_sky italic cursor-pointer" onClick={handleRegisterClick}> Sign up</span>
            </div>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full md:w-1/2 bg-cyan-100 flex items-center justify-center p-10">
        <motion.img
          src={doctorBanners[bannerId]}
          alt="Vector Art"
          className="max-w-md w-full h-auto object-contain"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </motion.div>
  );
};

export default LoginPage;
