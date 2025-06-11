import About from "./components/About.jsx";
import Home from "./components/Home.jsx";
import SignUp from "./components/SignUp.jsx";
import LogIn from "./components/LogIn.jsx";
import MainHeader from "./components/MainHeader";
import NotFound from "./components/NotFound.jsx";
import { Route, Routes} from "react-router-dom";
import AllDoctors from "./components/AllDoctors.jsx";
import Contact from "./components/Contact.jsx";

function App() {
  return (
    <div>
      <Routes>
      <Route path="/" element = {<MainHeader/>}>
        <Route index element = {<Home/>}></Route>
        <Route path="*" element = {<NotFound/>}></Route>
        <Route path="/about" element = {<About/>}></Route>
        <Route path="/signup" element = {<SignUp/>}></Route>
        <Route path="/allDoctors" element = {<AllDoctors/>}></Route>
        <Route path="/contact" element = {<Contact/>}></Route>
        <Route path="/login" element = {<LogIn/>}></Route>
      </Route>
      </Routes>
    </div>
  )
}

export default App
