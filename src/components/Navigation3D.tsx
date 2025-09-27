import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Mic, 
  Users, 
  BookOpen, 
  Zap, 
  DollarSign, 
  Mail, 
  BarChart3, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  Shield,
  Code,
  Briefcase
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  requiresAuth?: boolean;
}

const Navigation3D: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const userData = localStorage.getItem('user');
    setIsAuthenticated(authStatus);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [location]);

  const publicNavItems: NavigationItem[] = [
    {
      name: 'Home',
      path: '/',
      icon: <Home className="w-5 h-5" />,
      description: 'Welcome to Voxly',
      color: '#3b82f6'
    },
    {
      name: 'Voices',
      path: '/voices',
      icon: <Mic className="w-5 h-5" />,
      description: '43+ AI voices',
      color: '#8b5cf6'
    },
    {
      name: 'Features',
      path: '/features',
      icon: <Zap className="w-5 h-5" />,
      description: 'Powerful capabilities',
      color: '#10b981'
    },
    {
      name: 'Pricing',
      path: '/pricing',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Flexible plans',
      color: '#f59e0b'
    },
    {
      name: 'About',
      path: '/about',
      icon: <Users className="w-5 h-5" />,
      description: 'Our story',
      color: '#ef4444'
    },
    {
      name: 'Blog',
      path: '/blog',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Latest insights',
      color: '#06b6d4'
    },
    {
      name: 'Contact',
      path: '/contact',
      icon: <Mail className="w-5 h-5" />,
      description: 'Get in touch',
      color: '#84cc16'
    }
  ];

  const authNavItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Your analytics',
      color: '#3b82f6',
      requiresAuth: true
    },
    {
      name: 'Synthesis',
      path: '/synthesis',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Create voices',
      color: '#8b5cf6',
      requiresAuth: true
    },
    {
      name: 'API Docs',
      path: '/api-docs',
      icon: <Code className="w-5 h-5" />,
      description: 'Developer tools',
      color: '#10b981',
      requiresAuth: true
    }
  ];

  const footerNavItems: NavigationItem[] = [
    {
      name: 'Careers',
      path: '/careers',
      icon: <Briefcase className="w-5 h-5" />,
      description: 'Join our team',
      color: '#f59e0b'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Signed out successfully');
    navigate('/');
    setIsOpen(false);
  };

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const NavItem: React.FC<{ item: NavigationItem; onClick?: () => void }> = ({ item, onClick }) => {
    const isActive = isActivePath(item.path);
    
    return (
      <motion.div
        whileHover={{ scale: 1.05, x: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to={item.path}
          onClick={onClick}
          className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-200 group ${
            isActive
              ? 'bg-white/20 backdrop-blur-sm border border-white/30'
              : 'hover:bg-white/10 hover:backdrop-blur-sm'
          }`}
        >
          <div 
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isActive ? 'shadow-lg' : 'group-hover:shadow-md'
            }`}
            style={{ 
              backgroundColor: isActive ? item.color : `${item.color}20`,
              color: isActive ? 'white' : item.color
            }}
          >
            {item.icon}
          </div>
          <div className="flex-1">
            <div className={`font-medium transition-colors ${
              isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
            }`}>
              {item.name}
            </div>
            <div className="text-xs text-gray-400 group-hover:text-gray-300">
              {item.description}
            </div>
          </div>
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
          )}
        </Link>
      </motion.div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 lg:hidden w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center text-white shadow-lg"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Desktop Sidebar */}
      <motion.nav
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex fixed left-0 top-0 h-full w-80 bg-black/50 backdrop-blur-xl border-r border-white/10 z-40 flex-col"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                Voxly
              </h1>
              <p className="text-xs text-gray-400">Voice AI Revolution</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {/* Public Navigation */}
          <div className="space-y-2">
            {publicNavItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>

          {/* Authenticated Navigation */}
          {isAuthenticated && (
            <>
              <div className="my-6 border-t border-white/10 pt-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Your Account
                </h3>
                <div className="space-y-2">
                  {authNavItems.map((item) => (
                    <NavItem key={item.path} item={item} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Footer Navigation */}
          <div className="border-t border-white/10 pt-6 mt-6">
            <div className="space-y-2">
              {footerNavItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="p-6 border-t border-white/10">
          {isAuthenticated && user ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {user.username || user.email}
                  </div>
                  <div className="text-xs text-gray-400">
                    Premium Member
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-300 hover:text-red-200 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </motion.button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full text-center p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-medium transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block w-full text-center p-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-white font-medium transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Mobile Menu */}
            <motion.nav
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-black/90 backdrop-blur-xl border-l border-white/10 z-50 lg:hidden flex flex-col"
            >
              {/* Mobile Logo */}
              <div className="p-6 border-b border-white/10">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Voxly</h1>
                    <p className="text-xs text-gray-400">Voice AI Revolution</p>
                  </div>
                </Link>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {publicNavItems.map((item) => (
                  <NavItem key={item.path} item={item} onClick={() => setIsOpen(false)} />
                ))}
                
                {isAuthenticated && (
                  <>
                    <div className="my-4 border-t border-white/10 pt-4">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Your Account
                      </h3>
                      {authNavItems.map((item) => (
                        <NavItem key={item.path} item={item} onClick={() => setIsOpen(false)} />
                      ))}
                    </div>
                  </>
                )}

                <div className="border-t border-white/10 pt-4 mt-4">
                  {footerNavItems.map((item) => (
                    <NavItem key={item.path} item={item} onClick={() => setIsOpen(false)} />
                  ))}
                </div>
              </div>

              {/* Mobile User Section */}
              <div className="p-6 border-t border-white/10">
                {isAuthenticated && user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {user.username || user.email}
                        </div>
                        <div className="text-xs text-gray-400">Premium Member</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center p-3 bg-white/10 border border-white/20 rounded-xl text-white font-medium"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation3D;
