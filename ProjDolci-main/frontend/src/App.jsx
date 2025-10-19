import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import { Outlet } from "react-router-dom";

export default function App() {

  return (
    <div className="pageContainer">
      <Navbar/>
      <div className="pageContent">
        <Outlet />
      </div>
      <Footer/>
    </div>
  )
}


