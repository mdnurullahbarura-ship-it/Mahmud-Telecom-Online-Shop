import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Settings,
  Grid
} from 'lucide-react';
import { auth } from '../../services/firebase/config';
import { signOut } from 'firebase/auth';
import { useSettingsStore } from '../../store/useSettingsStore';
import toast from 'react-hot-toast';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();
  const { settings } = useSettingsStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('লগআউট সফল হয়েছে!');
      navigate('/login');
    } catch (error) {
      toast.error('লগআউট করা যায়নি।');
    }
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/admin/categories', icon: Grid, label: 'Categories' },
    { to: '/admin/customers', icon: Users, label: 'Customers' },
    { to: '/admin/legal', icon: FileText, label: 'Legal Pages' },
    { to: '/admin/settings', icon: Settings, label: 'Settings & Logo' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center justify-between">
            <Link to="/admin" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 shrink-0">
                {settings.logoUrl && !logoError ? (
                  <img 
                    src={settings.logoUrl} 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span>ম</span>
                )}
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Admin Panel
              </span>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => 
                  `flex items-center space-x-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 mt-auto">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-4 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 flex items-center justify-between sticky top-0 z-40">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-4 ml-auto">
            <button className="relative p-2.5 text-gray-400 hover:text-gray-500 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="flex items-center space-x-3 border-l border-gray-100 dark:border-gray-800 pl-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Admin</p>
                <p className="text-xs text-gray-400">admin@mahmudtelecom.com</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
