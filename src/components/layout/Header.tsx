import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Train, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Train size={24} className="text-white" />
              <span className="text-xl font-bold">RailConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 text-sm font-medium hover:text-blue-200 transition-colors">
              Home
            </Link>
            <Link to="/booking" className="px-3 py-2 text-sm font-medium hover:text-blue-200 transition-colors">
              Book Tickets
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/journeys" className="px-3 py-2 text-sm font-medium hover:text-blue-200 transition-colors">
                  My Journeys
                </Link>
                <Link to="/waiting-list" className="px-3 py-2 text-sm font-medium hover:text-blue-200 transition-colors">
                  Waiting List
                </Link>
              </>
            )}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:text-blue-200 transition-colors">
                  <User size={18} />
                  <span>{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-900 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-200 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-blue-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium hover:bg-blue-700 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/booking"
                className="block px-3 py-2 text-base font-medium hover:bg-blue-700 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Tickets
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/journeys"
                    className="block px-3 py-2 text-base font-medium hover:bg-blue-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Journeys
                  </Link>
                  <Link
                    to="/waiting-list"
                    className="block px-3 py-2 text-base font-medium hover:bg-blue-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Waiting List
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium hover:bg-blue-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                  >
                    Logout
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 p-3">
                  <Link
                    to="/login"
                    className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-blue-900 hover:bg-blue-100 px-4 py-2 rounded-md text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;