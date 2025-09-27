import { useState } from 'react'
import app from "./firebase";
import { Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from './components/navbar/navbar.jsx'
import LandingPage from './pages/customer/landing-page/landing-page.jsx';
import Signup from './pages/customer/authentication/signup.jsx';
import Login from './pages/customer/authentication/login.jsx';
import Homepage from './pages/customer/homepage/homepage.jsx';
import AboutPage from './pages/customer/homepage/about-page.jsx';
import ContactPage from './pages/customer/homepage/contact-page.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
          <Route path="/" element={<LandingPage isHome={false}/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/homepage" element={<Homepage isHome={true}/>} />
          <Route path="/about-page" element={<AboutPage />}/>
          <Route path="/contact-page" element={<ContactPage />} />
      </Routes>
    </>
  )
}

export default App
