import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { doctor_banner2 } from "../assets/Doc/init"; // Replace with your contact illustration

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-8 flex flex-col items-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-3xl shadow-lg p-8">
        {/* Left Side - Illustration & Info */}
        <div className="flex flex-col justify-center space-y-6">
          <img
            src={doctor_banner2}
            alt="Contact Illustration"
            className="w-full max-w-sm object-contain mx-auto"
          />
          <div className="space-y-3 text-gray-700 text-sm">
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-bg_sky" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-bg_sky" />
              <span>support@healthmate.com</span>
            </div>
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-bg_sky" />
              <span>123 Health Street, Wellness City, IN</span>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div>
          <h2 className="text-3xl font-bold text-bg_sky mb-6">Get in Touch 💬</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 outline-none text-sm"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 outline-none text-sm"
              required
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 outline-none text-sm resize-none"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-bg_sky text-white rounded-xl hover:bg-bg_sky transition text-sm"
            >
              Send Message ✉️
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
