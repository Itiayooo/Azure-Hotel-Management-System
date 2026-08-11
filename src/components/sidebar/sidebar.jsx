import logo from '../../assets/logo-ii.png'
import SidebarItem from './SidebarItem'
import Button from '../Button'

const Sidebar = () => {
    return (
        <aside className="h-screen w-64 bg-[#E6DED1] flex flex-col px-4 py-6">

            {/* Top */}
            <div>
                <img
                    src={logo}
                    alt="Logo"
                    className="mb-10 w-32 mx-auto"
                />

                <nav className="flex flex-col gap-2 mx-auto w-full items-center bg-black">
                    <SidebarItem to="/">Dashboard</SidebarItem>
                    <SidebarItem to="/guests">Guests</SidebarItem>
                    <SidebarItem to="/reservations">Reservations</SidebarItem>
                    <SidebarItem to="/rooms">Rooms</SidebarItem>
                </nav>
            </div>

            {/* Bottom */}
            <div className="mt-auto flex items-center justify-center">
                <button className="flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-[#6B5A44] hover:bg-white/60 rounded-lg w-4/5">
                    Log Out
                </button>

            </div>
        </aside>
    )
}

export default Sidebar
