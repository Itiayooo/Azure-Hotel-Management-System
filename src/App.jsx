import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import AboutUs from './pages/AboutPage'
import Footer from './components/Footer'
import ContactPage from './pages/ContactPage'
import HelpSection from './sections/HelpSection'

function App() {
  const [count, setCount] = useState(0)

  return (
    <> 
      {/* <LandingPage />
      <AboutUs />       */}
      <ContactPage />      
    </>
  )
}

export default App
