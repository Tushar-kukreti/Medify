import { NavLink } from "react-router-dom";

function Navbar(){
    return (
    <div>
        <div className="flex flex-row justify-between items-center py-4 w-11/12 mx-auto">
            {/* Logo */}
            <div></div>
            {/* Routes */}
            <nav className="flex gap-6 list-none">
                <NavLink to={"/"}>Home</NavLink>
                <NavLink to={"/allDoctors"}>All Doctors</NavLink>
                <NavLink to={"/about"}>About</NavLink>
                <NavLink to={"/contact"}>Contact</NavLink>
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
        <div className="w-full h-[1px] bg-slate-300 opacity-30"></div>
    </div>)
}

export default Navbar;