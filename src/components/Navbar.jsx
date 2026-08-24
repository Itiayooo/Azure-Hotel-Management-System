import React from 'react'
import logo from '../assets/GrandAzure Logo.png'


const Navbar = ({className}) => {
    // const navigate = useNavigate();

    return (
        <nav className="flex justify-between items-center py-[15px] px-[50px] text-white font-[Arial,sans-serif] z-[9999] font-['Mona_Sans']">
            <div className="flex items-center gap-[10px]">
                <img 
                    src={logo} 
                    alt="Logo" 
                    className="w-[157px] h-[75px]" 
                />
            </div>

            <div className="flex justify-between items-center w-[50%]">
                <ul className="flex list-none gap-[30px] m-0 p-0">
                    <li>
                        <a 
                            href="#home" 
                            className="text-white no-underline text-[16px] relative hover:underline"
                        >
                            Home
                        </a>
                    </li>

                    <li>
                        <a 
                            href="#about" 
                            className="text-white no-underline text-[16px] relative hover:underline"
                        >
                            About Us
                        </a>
                    </li>

                    <li>
                        <a 
                            href="#contact" 
                            className="text-white no-underline text-[16px] relative hover:underline"
                        >
                            Contact
                        </a>
                    </li>

                    <li>
                        <a 
                            href="#gallery" 
                            className="text-white no-underline text-[16px] relative hover:underline"
                        >
                            Gallery
                        </a>
                    </li>
                </ul>

                <div className="flex items-center justify-center gap-[15px] h-[8%]">
                    <button 
                        className="border border-white bg-transparent text-white py-[8px] px-[15px] rounded-[20px] cursor-pointer m-0 hover:bg-white hover:text-black"
                        onClick={() => navigate("/login")}
                    >
                        Sign In
                    </button>

                    <button 
                        className="bg-[#b68b47] text-white py-[8px] px-[15px] rounded-[20px] border-none cursor-pointer m-0 hover:bg-[#a37739]"
                        onClick={() => navigate("/signup")}
                    >
                        Register
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar