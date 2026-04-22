import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, LogOut, Cpu } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!token) return null;

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link to="/dashboard" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
                            <Cpu className="w-8 h-8" />
                            <span className="hidden sm:inline">AI Tasker</span>
                        </Link>
                        
                        <div className="hidden sm:flex gap-4">
                            <Link 
                                to="/dashboard" 
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isActive('/dashboard') 
                                    ? 'bg-primary-50 text-primary-700' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>
                            <Link 
                                to="/create" 
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isActive('/create') 
                                    ? 'bg-primary-50 text-primary-700' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                <PlusCircle size={18} />
                                Create Task
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
            
           
            <div className="sm:hidden border-t border-slate-100 bg-white flex justify-around py-2 px-4 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
                 <Link 
                    to="/dashboard" 
                    className={`flex flex-col items-center p-2 rounded-lg text-[10px] font-medium transition-colors ${
                        isActive('/dashboard') ? 'text-primary-600' : 'text-slate-500'
                    }`}
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </Link>
                <Link 
                    to="/create" 
                    className={`flex flex-col items-center p-2 rounded-lg text-[10px] font-medium transition-colors ${
                        isActive('/create') ? 'text-primary-600' : 'text-slate-500'
                    }`}
                >
                    <PlusCircle size={20} />
                    Create
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
