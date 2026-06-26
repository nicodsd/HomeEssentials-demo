import Navbar from "../components/Navigation/NavBar"
import Footer from "../components/Footer"
import { Outlet } from "react-router-dom"
import "../../App.css"

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}
