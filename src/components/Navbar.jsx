import { Link, NavLink } from "react-router-dom";
// import React from '../assets/logo.png'
import { useNavigate } from "react-router-dom";
import img1 from '../assets/logo.png'
function Navbar(){
    return (
    <div className="fixed top-0 left-0 right-0 bg-white z-10">
        <div className="flex flex-row justify-between items-center py-2 w-11/12 mx-auto">
            {/* Logo */}
            <Link to={"/"}>
                <img src={img1}
                className="w-[10rem] h-[3rem]"
                />
            </Link>
            {/* Routes */}
            <nav className="flex gap-6 list-none">
                <NavLink to={"/"} className={"transition-all duration-200 hover:opacity-50"}>
                    Home
                    <div className="w-auto h-[1px] bg-sky-600 mt-2 opacity-0 line duration-200 transition-opacity"></div>
                </NavLink>
                <NavLink to={"/allDoctors"} className={"transition-all duration-200 hover:opacity-50"}>
                    All Doctors
                    <div className="w-auto h-[1px] bg-sky-600 mt-2 opacity-0 line duration-200 transition-opacity"></div>
                </NavLink>
                <NavLink to={"/about"} className={"transition-all duration-200 hover:opacity-50"}>
                    About
                    <div className="w-auto h-[1px] bg-sky-600 mt-2 opacity-0 line duration-200 transition-opacity"></div>
                </NavLink>
                <NavLink to={"/contact"} className={"transition-all duration-200 hover:opacity-50"}>
                    Contact
                    <div className="w-auto h-[1px] bg-sky-600 mt-2 opacity-0 line duration-200 transition-opacity"></div>
                </NavLink>
            </nav>
            {/* User */}
            <div>
                <button 
                className="px-4 py-2 text-white bg-sky-600 duration-200 rounded-xl text-sm transition-opacity hover:opacity-75">
                    Sign Up
                </button>
            </div>
        </div>
        {/* Bottom - line */}
        <div className="w-full h-[1px] bg-slate-300 opacity-50"></div>
    </div>)
}

export default Navbar;