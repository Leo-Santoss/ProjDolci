import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";


import { Outlet } from "react-router-dom";


export default function App() {

  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}


