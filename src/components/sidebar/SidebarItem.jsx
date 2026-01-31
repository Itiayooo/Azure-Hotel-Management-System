import { NavLink } from "react-router-dom";

const SidebarItem = ({ to, children, icon }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-10 rounded-lg text-sm font-medium w-4/5 transition
        ${
          isActive
            ? "bg-white text-[#8B6B3D]"
            : "text-[#6B5A44] hover:bg-white/60"
        }`
      }
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </NavLink>
  );
};

export default SidebarItem;
