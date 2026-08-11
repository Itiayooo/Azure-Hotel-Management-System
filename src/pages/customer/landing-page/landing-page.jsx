// import { useNavigate } from 'react-router-dom'
// import React from 'react'
// import './landing-page.css'
// import heroImage from '../../../assets/hero-image.png'
// import welcomeImageI from '../../../assets/welcome-image-i.png'
// import welcomeImageII from '../../../assets/welcome-image-ii.png'
// import welcomeImageIII from '../../../assets/welcome-image-iii.png'
// import welcomeImageIV from '../../../assets/welcome-image-iv.png'
// import welcomeImageV from '../../../assets/welcome-image-v.png'
// import welcomeImageVI from '../../../assets/welcome-image-vi.png'
// // import Navbar from '../../../components/navbar/navbar'
// import NavbarI from '../../../components/navbar/navbar'
// import amazingImageI from '../../../assets/amazing-room-i.jpg'
// import amazingImageII from '../../../assets/amazing-room-ii.jpg'
// import amazingImageIII from '../../../assets/amazing-room-iii.jpg'
// import roomsListI from '../../../assets/rooms-list-i.png'
// import roomsListII from '../../../assets/rooms-list-ii.png'
// import roomsListIII from '../../../assets/rooms-list-iii.png'
// import roomsListIV from '../../../assets/rooms-list-iv.png'
// import roomsListV from '../../../assets/rooms-list-v.png'
// import roomsListVI from '../../../assets/rooms-list-vi.png'
// import Footer from '../../../components/footer/footer'


// const LandingPage = ({isHome}) => {
//     const navigate = useNavigate();

//     return (
//         <div className='landing-page'>
//             <div className='hero-section'>
//                 <NavbarI />
//                 <h1>Experience Comfort, Luxury, and Serenity</h1>
//                 <p>Escape the ordinary and indulge in a refined stay where world-class amenities, exceptional service, and breathtaking surroundings come together to create unforgettable memories whether you're here for business, romance, or relaxation.</p>

//                 <div className="search-box">
//                     <div className="search-item">
//                         <label><i className="fas fa-map-marker-alt"></i> Location</label>
//                         <input type="text" placeholder="Type Location" />
//                     </div>

//                     <div className="search-item">
//                         <label><i className="fas fa-user"></i> Person</label>
//                         <select>
//                             <option>Person</option>
//                             <option>1 Person</option>
//                             <option>2 People</option>
//                             <option>3+ People</option>
//                         </select>
//                     </div>

//                     <div className="search-item">
//                         <label><i className="fas fa-calendar-alt"></i> Check-In</label>
//                         <input type="date" />
//                     </div>

//                     <div className="search-item">
//                         <label><i className="fas fa-calendar-alt"></i> Check-Out</label>
//                         <input type="date" />
//                     </div>

//                     <button className="search-btn">Search</button>
//                 </div>

//                 <br />
//                 <br />
//             </div>

//             <section className="gallery-section">
//                 <h2 className="gallery-title">Welcome To Serenity</h2>
//                 <p className="gallery-subtitle">
//                     Experience comfort and elegance like never before, with spaces designed for relaxation and luxury.
//                 </p>

//                 <div className="gallery-grid">
//                     <img src={welcomeImageI} alt="Room" />
//                     <img src={welcomeImageII} alt="Room" />
//                     <img src={welcomeImageIII} alt="Room" />
//                     <img src={welcomeImageIV} alt="Room" />
//                     <img src={welcomeImageV} alt="Room" />
//                     <img src={welcomeImageVI} alt="Room" />
//                 </div>
//             </section>

//             <section className="amazing-rooms-section">
//                 <h2 className="amazing-title">Our Most Amazing Visited Room In 2025</h2>
//                 {/* <h3 className="amazing-subtitle">Visited Room In 2025</h3> */}
//                 <p className="amazing-description">
//                     Discover our most luxurious and highly rated rooms designed to offer ultimate comfort and elegance.
//                 </p>

//                 <div className="amazing-grid">
//                     <div className="amazing-card large-card">
//                         <img src={amazingImageI} alt="Luxury Room" />
//                         <div className="overlay">
//                             <h4>Okazaki Stand, East Board</h4>
//                             <p>Okazaki Stand, East Board ★★★★★</p>
//                             <span className="arrow">➔</span>
//                         </div>
//                     </div>

//                     <div className="small-card-container">
//                         <div className="amazing-card small-card">
//                             <img src={amazingImageII} alt="Luxury Room" />
//                             <div className="overlay">
//                                 <h4>Okazaki Stand, East Board</h4>
//                                 <p>Okazaki Stand, East Board ★★★★★</p>
//                                 <span className="arrow">➔</span>
//                             </div>
//                         </div>
//                         <div className="amazing-card small-card">
//                             <img src={amazingImageIII} alt="Luxury Room" />
//                             <div className="overlay">
//                                 <h4>Okazaki Stand, East Board</h4>
//                                 <p>Okazaki Stand, East Board ★★★★★</p>
//                                 <span className="arrow">➔</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             <section className="rooms-list-container">
//                 <div class="rooms-list-header">
//                     <h2>Explore Our Best Rooms List</h2>
//                     <div class="rooms-list-search">
//                         <p>Discover luxury and comfort in our exclusive collection of suites, designed to give you the perfect stay.</p>
//                         <input type="text" placeholder='Find Rooms 🔍' />
//                     </div>
//                 </div>

//                 <div class="rooms-list-grid">

//                     <div class="rooms-list-card">
//                         <img src={roomsListI} alt="Luxury Room" />
//                         <div class="rooms-list-info">
//                             <h3>Presidential Suite</h3>
//                             <p>Okazaki Stand, East Board</p>
//                             <div class="rooms-list-stars">★★★★☆</div>
//                         </div>
//                     </div>

//                     <div class="rooms-list-card">
//                         <img src={roomsListII} alt="Luxury Room" />
//                         <div class="rooms-list-info">
//                             <h3>Presidential Suite</h3>
//                             <p>Okazaki Stand, East Board</p>
//                             <div class="rooms-list-stars">★★★★★</div>
//                         </div>
//                     </div>

//                     <div class="rooms-list-card">
//                         <img src={roomsListIII} alt="Luxury Room" />
//                         <div class="rooms-list-info">
//                             <h3>Presidential Suite</h3>
//                             <p>Okazaki Stand, East Board</p>
//                             <div class="rooms-list-stars">★★★★★</div>
//                         </div>
//                     </div>

//                     <div class="rooms-list-card">
//                         <img src={roomsListIV} alt="Luxury Room" />
//                         <div class="rooms-list-info">
//                             <h3>Presidential Suite</h3>
//                             <p>Okazaki Stand, East Board</p>
//                             <div class="rooms-list-stars">★★★★☆</div>
//                         </div>
//                     </div>

//                     <div class="rooms-list-card">
//                         <img src={roomsListV} alt="Luxury Room" />
//                         <div class="rooms-list-info">
//                             <h3>Presidential Suite</h3>
//                             <p>Okazaki Stand, East Board</p>
//                             <div class="rooms-list-stars">★★★★☆</div>
//                         </div>
//                     </div>

//                     <div class="rooms-list-card">
//                         <img src={roomsListVI} alt="Luxury Room" />
//                         <div class="rooms-list-info">
//                             <h3>Presidential Suite</h3>
//                             <p>Okazaki Stand, East Board</p>
//                             <div class="rooms-list-stars">★★★★☆</div>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             <Footer />
//         </div >
//     )
// }

// export default LandingPage

import React from 'react'
import { useNavigate } from 'react-router-dom'
import heroImage from '../../../assets/hero-image.png'
import welcomeImageI from '../../../assets/welcome-image-i.png'
import welcomeImageII from '../../../assets/welcome-image-ii.png'
import welcomeImageIII from '../../../assets/welcome-image-iii.png'
import welcomeImageIV from '../../../assets/welcome-image-iv.png'
import welcomeImageV from '../../../assets/welcome-image-v.png'
import welcomeImageVI from '../../../assets/welcome-image-vi.png'
import NavbarI from '../../../components/navbar/navbar'
import amazingImageI from '../../../assets/amazing-room-i.jpg'
import amazingImageII from '../../../assets/amazing-room-ii.jpg'
import amazingImageIII from '../../../assets/amazing-room-iii.jpg'
import roomsListI from '../../../assets/rooms-list-i.png'
import roomsListII from '../../../assets/rooms-list-ii.png'
import roomsListIII from '../../../assets/rooms-list-iii.png'
import roomsListIV from '../../../assets/rooms-list-iv.png'
import roomsListV from '../../../assets/rooms-list-v.png'
import roomsListVI from '../../../assets/rooms-list-vi.png'
import Footer from '../../../components/footer/footer'

const LandingPage = ({ isHome }) => {
  const navigate = useNavigate()

  return (
    <div className="font-['Mona_Sans',sans-serif]">
      {/* Hero Section */}
      <div 
        className="relative z-0 w-full mx-auto bg-darkblue bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <NavbarI />
        <h1 className="text-white font-medium text-[56px] w-[500px] ml-[50px] mt-[50px] leading-[1.4]">
          Experience Comfort, Luxury, and Serenity
        </h1>
        <p className="text-white w-[700px] ml-[50px] mt-[20px]">
          Escape the ordinary and indulge in a refined stay where world-class amenities, exceptional service, and breathtaking surroundings come together to create unforgettable memories whether you're here for business, romance, or relaxation.
        </p>

        <div className="flex flex-wrap gap-[15px] bg-white p-[20px] my-[40px] mx-[50px] rounded-[12px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] justify-between items-center max-md:flex-col max-md:items-stretch max-md:gap-[12px]">
          <div className="flex flex-col font-sans text-[14px] flex-1 min-w-[150px]">
            <label className="mb-[6px] text-[#333] font-medium">
              <i className="fas fa-map-marker-alt"></i> Location
            </label>
            <input 
              type="text" 
              placeholder="Type Location" 
              className="p-[14px] border-none rounded-[8px] bg-[#f4f4f4] text-[14px] outline-none"
            />
          </div>

          <div className="flex flex-col font-sans text-[14px] flex-1 min-w-[150px]">
            <label className="mb-[6px] text-[#333] font-medium">
              <i className="fas fa-user"></i> Person
            </label>
            <select className="p-[14px] border-none rounded-[8px] bg-[#f4f4f4] text-[14px] outline-none">
              <option>Person</option>
              <option>1 Person</option>
              <option>2 People</option>
              <option>3+ People</option>
            </select>
          </div>

          <div className="flex flex-col font-sans text-[14px] flex-1 min-w-[150px]">
            <label className="mb-[6px] text-[#333] font-medium">
              <i className="fas fa-calendar-alt"></i> Check-In
            </label>
            <input 
              type="date" 
              className="p-[14px] border-none rounded-[8px] bg-[#f4f4f4] text-[14px] outline-none"
            />
          </div>

          <div className="flex flex-col font-sans text-[14px] flex-1 min-w-[150px]">
            <label className="mb-[6px] text-[#333] font-medium">
              <i className="fas fa-calendar-alt"></i> Check-Out
            </label>
            <input 
              type="date" 
              className="p-[14px] border-none rounded-[8px] bg-[#f4f4f4] text-[14px] outline-none"
            />
          </div>

          <button className="bg-[#8a633a] text-white py-[14px] px-[28px] border-none rounded-[8px] text-[16px] cursor-pointer transition-all duration-300 ease-in-out mt-[22px] hover:bg-[#6d4f29] max-md:w-full">
            Search
          </button>
        </div>

        <br />
        <br />
      </div>

      {/* Gallery Section */}
      <section className="text-center py-[40px] px-[20px] font-sans">
        <h2 className="text-[32px] font-medium mb-[10px]">Welcome To Serenity</h2>
        <p className="text-[16px] text-[#666] mb-[30px] max-w-[600px] mx-auto">
          Experience comfort and elegance like never before, with spaces designed for relaxation and luxury.
        </p>

        <div className="w-[60%] grid grid-cols-3 gap-[20px] mx-auto justify-center">
          <img src={welcomeImageI} alt="Room" className="w-full h-[220px] object-cover rounded-[12px]" />
          <img src={welcomeImageII} alt="Room" className="w-full h-[220px] object-cover rounded-[12px]" />
          <img src={welcomeImageIII} alt="Room" className="w-full h-[220px] object-cover rounded-[12px]" />
          <img src={welcomeImageIV} alt="Room" className="w-full h-[220px] object-cover rounded-[12px]" />
          <img src={welcomeImageV} alt="Room" className="w-full h-[220px] object-cover rounded-[12px]" />
          <img src={welcomeImageVI} alt="Room" className="w-full h-[220px] object-cover rounded-[12px]" />
        </div>
      </section>

      {/* Amazing Rooms Section */}
      <section className="text-center py-[40px] px-[20px] h-[650px]">
        <h2 className="text-[32px] font-[450] w-[30%] mx-auto text-center">
          Our Most Amazing Visited Room In 2025
        </h2>
        <p className="text-[16px] text-[#666] mb-[30px] max-w-[600px] mx-auto">
          Discover our most luxurious and highly rated rooms designed to offer ultimate comfort and elegance.
        </p>

        <div className="flex gap-[20px] justify-center items-stretch flex-wrap h-[10px]">
          <div className="relative overflow-hidden rounded-[12px] w-[50%] h-[80vh]">
            <img src={amazingImageI} alt="Luxury Room" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 w-full p-[20px] text-white bg-gradient-to-t from-black/60 to-transparent rounded-[12px]">
              <h4 className="text-[20px] m-0">Okazaki Stand, East Board</h4>
              <p className="text-[14px] my-[5px] mx-0">Okazaki Stand, East Board ★★★★★</p>
              <span className="absolute bottom-[20px] right-[20px] text-[24px] cursor-pointer transition-transform duration-1000 ease-in-out hover:scale-125">
                ➔
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-[20px] w-[50%] h-[80vh]">
            <div className="relative overflow-hidden rounded-[12px]">
              <img src={amazingImageII} alt="Luxury Room" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 w-full p-[20px] text-white bg-gradient-to-t from-black/60 to-transparent rounded-[12px]">
                <h4 className="text-[20px] m-0">Okazaki Stand, East Board</h4>
                <p className="text-[14px] my-[5px] mx-0">Okazaki Stand, East Board ★★★★★</p>
                <span className="absolute bottom-[20px] right-[20px] text-[24px] cursor-pointer transition-transform duration-1000 ease-in-out hover:scale-125">
                  ➔
                </span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[12px]">
              <img src={amazingImageIII} alt="Luxury Room" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 w-full p-[20px] text-white bg-gradient-to-t from-black/60 to-transparent rounded-[12px]">
                <h4 className="text-[20px] m-0">Okazaki Stand, East Board</h4>
                <p className="text-[14px] my-[5px] mx-0">Okazaki Stand, East Board ★★★★★</p>
                <span className="absolute bottom-[20px] right-[20px] text-[24px] cursor-pointer transition-transform duration-1000 ease-in-out hover:scale-125">
                  ➔
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms List Container */}
      <section className="w-[90%] max-w-[1200px] mx-auto py-[40px] px-0">
        <div className="flex justify-between items-start mb-[30px]">
          <h2 className="text-[2.5rem] leading-[1.3] w-[30%] font-[450]">
            Explore Our Best Rooms List
          </h2>
          <div className="text-right">
            <p className="text-[14px] text-[#888] mb-[10px] max-w-[280px] w-full">
              Discover luxury and comfort in our exclusive collection of suites, designed to give you the perfect stay.
            </p>
            <input 
              type="text" 
              placeholder="Find Rooms 🔍" 
              className="py-[10px] px-[15px] border border-[#ddd] rounded-[25px] w-[200px] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[25px]">
          <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_4px_10px_rgba(255,255,255,0.1)] transition-transform duration-300 ease-in-out hover:-translate-y-[5px]">
            <img src={roomsListI} alt="Luxury Room" className="w-full h-[200px] object-cover" />
            <div className="p-[15px]">
              <h3 className="m-0 text-[18px] font-['Mona_Sans',sans-serif] font-medium">Presidential Suite</h3>
              <p className="text-[14px] text-[#aaa] my-[5px] mx-0 mb-[10px]">Okazaki Stand, East Board</p>
              <div className="text-orange-500 text-[16px]">★★★★☆</div>
            </div>
          </div>

          <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_4px_10px_rgba(255,255,255,0.1)] transition-transform duration-300 ease-in-out hover:-translate-y-[5px]">
            <img src={roomsListII} alt="Luxury Room" className="w-full h-[200px] object-cover" />
            <div className="p-[15px]">
              <h3 className="m-0 text-[18px] font-['Mona_Sans',sans-serif] font-medium">Presidential Suite</h3>
              <p className="text-[14px] text-[#aaa] my-[5px] mx-0 mb-[10px]">Okazaki Stand, East Board</p>
              <div className="text-orange-500 text-[16px]">★★★★★</div>
            </div>
          </div>

          <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_4px_10px_rgba(255,255,255,0.1)] transition-transform duration-300 ease-in-out hover:-translate-y-[5px]">
            <img src={roomsListIII} alt="Luxury Room" className="w-full h-[200px] object-cover" />
            <div className="p-[15px]">
              <h3 className="m-0 text-[18px] font-['Mona_Sans',sans-serif] font-medium">Presidential Suite</h3>
              <p className="text-[14px] text-[#aaa] my-[5px] mx-0 mb-[10px]">Okazaki Stand, East Board</p>
              <div className="text-orange-500 text-[16px]">★★★★★</div>
            </div>
          </div>

          <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_4px_10px_rgba(255,255,255,0.1)] transition-transform duration-300 ease-in-out hover:-translate-y-[5px]">
            <img src={roomsListIV} alt="Luxury Room" className="w-full h-[200px] object-cover" />
            <div className="p-[15px]">
              <h3 className="m-0 text-[18px] font-['Mona_Sans',sans-serif] font-medium">Presidential Suite</h3>
              <p className="text-[14px] text-[#aaa] my-[5px] mx-0 mb-[10px]">Okazaki Stand, East Board</p>
              <div className="text-orange-500 text-[16px]">★★★★☆</div>
            </div>
          </div>

          <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_4px_10px_rgba(255,255,255,0.1)] transition-transform duration-300 ease-in-out hover:-translate-y-[5px]">
            <img src={roomsListV} alt="Luxury Room" className="w-full h-[200px] object-cover" />
            <div className="p-[15px]">
              <h3 className="m-0 text-[18px] font-['Mona_Sans',sans-serif] font-medium">Presidential Suite</h3>
              <p className="text-[14px] text-[#aaa] my-[5px] mx-0 mb-[10px]">Okazaki Stand, East Board</p>
              <div className="text-orange-500 text-[16px]">★★★★☆</div>
            </div>
          </div>

          <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_4px_10px_rgba(255,255,255,0.1)] transition-transform duration-300 ease-in-out hover:-translate-y-[5px]">
            <img src={roomsListVI} alt="Luxury Room" className="w-full h-[200px] object-cover" />
            <div className="p-[15px]">
              <h3 className="m-0 text-[18px] font-['Mona_Sans',sans-serif] font-medium">Presidential Suite</h3>
              <p className="text-[14px] text-[#aaa] my-[5px] mx-0 mb-[10px]">Okazaki Stand, East Board</p>
              <div className="text-orange-500 text-[16px]">★★★★☆</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
