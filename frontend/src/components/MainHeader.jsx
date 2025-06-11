import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function MainHeader(){
    return (<div className="relative min-h-screen flex flex-col justify-between">
      <Navbar></Navbar>        
      <div className="mt-16">
        <Outlet/>
      </div>
      <Footer className=""></Footer>
    </div>)
}
export default MainHeader;