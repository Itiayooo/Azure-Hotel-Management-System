import { useState } from 'react'
import app from "./firebase";
import { Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from './components/navbar/navbar.jsx'
import LandingPage from './pages/customer/landing-page/landing-page.jsx';
import Signup from './pages/customer/authentication/signup.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App
