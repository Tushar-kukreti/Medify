import React from "react";
import { doctor_banner1 } from "../assets/Doc/init";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 py-12 px-6 flex flex-col items-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Vector Illustration */}
        <div className="flex justify-center">
          <img
            src={doctor_banner1}
            alt="About Illustration"
            className="w-full max-w-md object-contain"
          />
        </div>

        {/* Right Content */}
        <div className="text-gray-800">
          <h1 className="text-4xl font-bold mb-4 text-bg_sky">About Us</h1>
          <p className="text-lg mb-4">
            Welcome to <span className="font-semibold text-bg_sky">Medify</span> — your trusted partner in health and care 🤝💙
          </p>
          <p className="text-md mb-4">
            We believe that healthcare should feel personal, simple, and safe. Whether you're here to look after your loved ones or to serve with your medical expertise — you're in good hands.
          </p>
          <p className="text-md mb-4">
            HealthMate is built to make your journey smoother — whether you're tracking your health, finding the right doctor, or managing your practice with ease. 👨‍⚕️👩‍⚕️
          </p>
          <p className="text-md mb-4">
            What makes us special? A focus on care, simplicity, and trust:
          </p>
          <ul className="list-disc list-inside text-md space-y-1">
            <li>💡 Easy, step-by-step registration tailored to your role</li>
            <li>👥 Personalized experience for patients and doctors</li>
            <li>🔒 Secure platform, built with modern tech</li>
            <li>🎨 Friendly, clean visuals for a joyful experience</li>
          </ul>
          <p className="mt-6 text-md text-gray-700">
            At HealthMate, you're not just signing up — you're joining a space where care meets technology. We're here to support you every step of the way. 💫
          </p>
          <p className="mt-2 text-md text-gray-700">
            Thank you for being here with us. Let’s take care of each other. 🌱🩺
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
