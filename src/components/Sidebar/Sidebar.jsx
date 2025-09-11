import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
// --- Using react-icons for a professional and consistent icon set ---
import { 
    HiChartPie, 
    HiOutlineUserCircle, 
    HiOutlineUsers, 
    HiOutlineViewColumns, 
    HiOutlineCog6Tooth, 
    HiXMark,
    HiArrowLeftOnRectangle,
    HiOutlineCubeTransparent // A more abstract and professional icon for Workflows
} from "react-icons/hi2";


// --- A Senior Dev practice: Break down UI into logical, single-responsibility components ---

const SidebarHeader = () => (
    <div className="flex items-center justify-center p-4 border-b border-slate-700 h-16">
        <div className="flex items-center gap-2">
            {/* Placeholder for a logo */}
            <div className="bg-green-500 p-2 rounded-lg">
                <HiOutlineViewColumns className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">CRM Pro</h1>
        </div>
    </div>
);

const NavItem = ({ item, isActive, onClick }) => (
    <li>
        <button
            onClick={onClick}
            className={`group w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
        >
            <span className={`transition-colors ${isActive ? 'text-green-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
                <item.icon className="w-5 h-5" />
            </span>
            <span className="ml-3">{item.name}</span>
        </button>
    </li>
);

const SidebarFooter = ({ user, onLogout }) => (
    <div className="p-4 border-t border-slate-700">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="inline-block h-9 w-9 rounded-full overflow-hidden bg-slate-700">
                    <HiOutlineUserCircle className="h-full w-full text-slate-500" />
                </span>
                <div>
                    <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-400">{user?.email || 'user@example.com'}</p>
                </div>
            </div>
            <button 
                className="text-slate-400 hover:text-white transition-colors" 
                aria-label="Log out"
                onClick={onLogout}
            >
                <HiArrowLeftOnRectangle className="w-5 h-5" />
            </button>
        </div>
    </div>
);


const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- Using react-icons components directly in the data structure ---
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HiChartPie },
    { name: 'Profile', path: '/profile', icon: HiOutlineUserCircle },
    { name: 'Contacts', path: '/contacts', icon: HiOutlineUsers },
    { name: 'Pipelines', path: '/pipelines', icon: HiOutlineViewColumns },
    { name: 'Workflows', path: '/workflows', icon: HiOutlineCubeTransparent },
    { name: 'Settings', path: '/settings', icon: HiOutlineCog6Tooth },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const user = useSelector((state) => state.auth.user);

  // --- Redesigned UI Starts Here ---
  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-40 h-full w-64 bg-slate-900 flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarHeader />
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                isActive={location.pathname.startsWith(item.path)} // Use startsWith for better matching
                onClick={() => handleNavigation(item.path)}
              />
            ))}
          </ul>
        </nav>

        <SidebarFooter user={user} onLogout={handleLogout} />
      </aside>
    </>
  );
};

export default Sidebar;
