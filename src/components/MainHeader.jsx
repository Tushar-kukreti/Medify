import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function MainHeader(){
    return (<>
      <Navbar></Navbar>        
        <Outlet/>
    </>)
}
export default MainHeader;