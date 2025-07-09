import React from "react";

export default function FooterBar() {
  return (
    <footer className="bg-gradient-to-tr from-indigo-50 to-white border-t border-gray-200 shadow-inner py-6 text-sm text-gray-600">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-bg_sky font-bold mb-2">Healthy Living</h3>
          <p className="text-gray-500">
            Empowering you to take charge of your wellness with accurate, accessible, and trusted health tools and resources.
          </p>
        </div>

        <div>
          <h3 className="text-bg_sky font-bold mb-2">Useful Resources</h3>
          <ul className="space-y-1">
            <li>
              <a href="https://www.who.int/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition">
                World Health Organization (WHO)
              </a>
            </li>
            <li>
              <a href="https://www.webmd.com/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition">
                WebMD – Medical Info & Tools
              </a>
            </li>
            <li>
              <a href="https://www.mayoclinic.org/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition">
                Mayo Clinic Health Info
              </a>
            </li>
            <li>
              <a href="https://www.cdc.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition">
                CDC – Health & Safety Guidelines
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-bg_sky font-bold mb-2">Stay Connected</h3>
          <p className="text-gray-500 mb-2">
            For inquiries or support:
          </p>
          <a href="mailto:support@healthapp.com" className="text-indigo-500 hover:underline">
            support@medify.com
          </a>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-6">
        &copy; {new Date().getFullYear()} HealthApp. All rights reserved.
      </div>
    </footer>
  );
}
