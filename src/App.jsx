import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import AboutUs from './pages/AboutPage'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <> 
      <LandingPage />
      {/* <AboutUs />       */}
    </>
  )
}

export default App
