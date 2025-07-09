import { Link, NavLink, useNavigate } from "react-router-dom";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import img1 from '../assets/logo.png';
import { useSelector, useDispatch } from "react-redux";
import { MdAccountCircle } from "react-icons/md";
import { fetchUser, logOutUser } from "../app/userSlice";
import { toast } from "react-toastify";
function Navbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const userNav = ["/", "/allDoctors", "/about", "/contact"];
  const doctorNav = ["/dashBoard", "/appointments", "/about", "/contact"];
  const dropdownRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    document.querySelector("html").classList.remove("light", "dark");
    document.querySelector("html").classList.add(theme);
  }, [theme]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const RegisterBtn = () =>{
    return (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="px-4 py-2 text-white bg-bg_grey duration-200 rounded-xl text-sm transition-opacity hover:opacity-75"
            >
              Register/Login
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden z-50 animate-fade-in-up">
                <button
                  onClick={() => {
                    navigate("/login");
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Register
                </button>
              </div>
            )}
          </div>)
  }

  const AccountBtn = () =>{
      return (
          <div className="relative">
              <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="px-2 py-2 text-bg_white bg-bg_grey duration-200 rounded-full text-sm transition-opacity hover:opacity-75"
              >
              <MdAccountCircle className="text-2xl" />
              </button>
      
              {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden z-50 animate-fade-in-up">
                  <button
                  onClick={() => {
                      navigate("/profile");
                      setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                  Profile
                  </button>
                  <button
                  onClick={() => {
                      dispatch(logOutUser())
                      .then(()=>{
                        navigate("/");
                        toast.success("Logout Successful.", { position: "bottom-left" });
                      }).catch((error) => {
                        toast.error(error.message || "Registration failed", { position: "bottom-left" });
                      });
                      setDropdownOpen(false);
                    }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                  Logout
                  </button>
              </div>
              )}
          </div>
      )
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-bg_white dark:bg-gray-400 dark:text-bg_white z-50">
      <div className="flex flex-row justify-between items-center py-2 w-11/12 mx-auto">
        {/* Logo */}
        <Link to={"/"}>
          <img src={img1} className="w-[10rem] h-[3rem]" />
        </Link>

        {/* Routes */}
        <nav className="flex gap-6 list-none">
          {
          ((userInfo && userInfo.role === 'doctor') ? doctorNav : userNav).map((path, i) => (
            <NavLink
              key={i}
              to={path}
              className="transition-all duration-200 hover:opacity-50 text-md font-semibold"
            >
              {path === "/" ? "Home" : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
              <div className="w-auto h-[1px] bg-sky-600 mt-2 opacity-0 line duration-200 transition-opacity"></div>
            </NavLink>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex gap-4 items-center relative" ref={dropdownRef}>
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "dark" ? (
              <MdDarkMode className="text-2xl text-slate-600 hover:opacity-75 duration-200" />
            ) : (
              <MdOutlineDarkMode className="text-2xl text-slate-600 hover:opacity-75 duration-200" />
            )}
          </button>

            {/* register/login / account btn */}
            { (!userInfo) ? <RegisterBtn/> : <AccountBtn/> }
        </div>
      </div>

      {/* Bottom line */}
      <div className="w-full h-[1px] bg-slate-300 opacity-50"></div>
    </div>
  );
}

export default Navbar;
