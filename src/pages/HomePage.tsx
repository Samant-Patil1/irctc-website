import React from 'react';
import { Link } from 'react-router-dom';
import { Train, Search, Clock, CreditCard, User } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2031758/pexels-photo-2031758.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Travel India by Train with Comfort
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Book your train tickets online with ease. Experience a seamless journey with our premium booking platform.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link 
                to="/booking" 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium text-center transition-colors flex items-center justify-center gap-2"
              >
                <Train size={20} />
                Book Now
              </Link>
              <Link 
                to="/waiting-list" 
                className="bg-white text-blue-900 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium text-center transition-colors"
              >
                Check Waiting List
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Book your train tickets in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md text-center"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="bg-blue-100 text-blue-800 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <Search size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-600">
                Enter your destination and travel date to find available trains
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md text-center"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="bg-blue-100 text-blue-800 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <Train size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Select</h3>
              <p className="text-gray-600">
                Choose from available trains and select your preferred class
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md text-center"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="bg-blue-100 text-blue-800 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <User size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book</h3>
              <p className="text-gray-600">
                Fill in passenger details and choose your preferred seats
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md text-center"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="bg-blue-100 text-blue-800 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <CreditCard size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pay</h3>
              <p className="text-gray-600">
                Complete your booking with our secure payment methods
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Routes</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore some of the most popular train routes across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Route 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-[url('https://images.pexels.com/photos/1007773/pexels-photo-1007773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-semibold text-lg">Delhi</div>
                  <div className="text-gray-500">to</div>
                  <div className="font-semibold text-lg">Mumbai</div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>17 hours</span>
                  </div>
                  <div>
                    <span className="text-blue-800 font-semibold">6 trains daily</span>
                  </div>
                </div>
                <Link to="/booking" className="block text-center bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-md transition-colors">
                  Book Now
                </Link>
              </div>
            </div>

            {/* Route 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-[url('https://images.pexels.com/photos/3464632/pexels-photo-3464632.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-semibold text-lg">Bangalore</div>
                  <div className="text-gray-500">to</div>
                  <div className="font-semibold text-lg">Chennai</div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>6 hours</span>
                  </div>
                  <div>
                    <span className="text-blue-800 font-semibold">8 trains daily</span>
                  </div>
                </div>
                <Link to="/booking" className="block text-center bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-md transition-colors">
                  Book Now
                </Link>
              </div>
            </div>

            {/* Route 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-[url('https://images.pexels.com/photos/2389476/pexels-photo-2389476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-semibold text-lg">Kolkata</div>
                  <div className="text-gray-500">to</div>
                  <div className="font-semibold text-lg">Delhi</div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>20 hours</span>
                  </div>
                  <div>
                    <span className="text-blue-800 font-semibold">4 trains daily</span>
                  </div>
                </div>
                <Link to="/booking" className="block text-center bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-md transition-colors">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Book your train tickets today and enjoy a hassle-free travel experience
          </p>
          <Link 
            to="/booking" 
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;