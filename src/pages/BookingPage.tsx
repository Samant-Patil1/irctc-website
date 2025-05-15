import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBooking, Station } from '../contexts/BookingContext';
import { format } from 'date-fns';

// Mock data for stations
const mockStations: Station[] = [
  { id: '1', name: 'New Delhi', code: 'NDLS' },
  { id: '2', name: 'Mumbai Central', code: 'MMCT' },
  { id: '3', name: 'Chennai Central', code: 'MAS' },
  { id: '4', name: 'Kolkata Howrah', code: 'HWH' },
  { id: '5', name: 'Bangalore City', code: 'SBC' },
  { id: '6', name: 'Hyderabad', code: 'HYD' },
  { id: '7', name: 'Ahmedabad', code: 'ADI' },
  { id: '8', name: 'Pune', code: 'PUNE' },
  { id: '9', name: 'Jaipur', code: 'JP' },
  { id: '10', name: 'Lucknow', code: 'LKO' },
];

// Train classes
const trainClasses = [
  { id: 'all', name: 'All Classes' },
  { id: 'SL', name: 'Sleeper Class' },
  { id: '3A', name: 'AC 3 Tier' },
  { id: '2A', name: 'AC 2 Tier' },
  { id: '1A', name: 'AC First Class' },
  { id: 'CC', name: 'Chair Car' },
  { id: 'EC', name: 'Executive Class' },
];

const BookingPage: React.FC = () => {
  const { searchCriteria, setSearchCriteria } = useBooking();
  const navigate = useNavigate();
  
  const [fromSearchText, setFromSearchText] = useState('');
  const [toSearchText, setToSearchText] = useState('');
  const [filteredFromStations, setFilteredFromStations] = useState<Station[]>([]);
  const [filteredToStations, setFilteredToStations] = useState<Station[]>([]);
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    from?: string;
    to?: string;
    date?: string;
    sameStations?: string;
  }>({});

  // Initialize searchCriteria.date if empty
  useEffect(() => {
    if (!searchCriteria.date) {
      setSearchCriteria({
        ...searchCriteria,
        date: format(new Date(), 'yyyy-MM-dd')
      });
    }
  }, [searchCriteria, setSearchCriteria]);

  // Update filtered stations when search text changes
  useEffect(() => {
    const filterStations = (text: string) => {
      return mockStations.filter(
        station => 
          station.name.toLowerCase().includes(text.toLowerCase()) || 
          station.code.toLowerCase().includes(text.toLowerCase())
      );
    };

    setFilteredFromStations(filterStations(fromSearchText));
    setFilteredToStations(filterStations(toSearchText));
  }, [fromSearchText, toSearchText]);

  // Set initial search text values from context
  useEffect(() => {
    if (searchCriteria.from) {
      setFromSearchText(searchCriteria.from.name);
    }
    if (searchCriteria.to) {
      setToSearchText(searchCriteria.to.name);
    }
  }, [searchCriteria.from, searchCriteria.to]);

  const handleFromStationSelect = (station: Station) => {
    setSearchCriteria({
      ...searchCriteria,
      from: station
    });
    setFromSearchText(station.name);
    setIsFromDropdownOpen(false);
    setFormErrors({ ...formErrors, from: undefined, sameStations: undefined });
  };

  const handleToStationSelect = (station: Station) => {
    setSearchCriteria({
      ...searchCriteria,
      to: station
    });
    setToSearchText(station.name);
    setIsToDropdownOpen(false);
    setFormErrors({ ...formErrors, to: undefined, sameStations: undefined });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCriteria({
      ...searchCriteria,
      date: e.target.value
    });
    setFormErrors({ ...formErrors, date: undefined });
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchCriteria({
      ...searchCriteria,
      class: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: {
      from?: string;
      to?: string;
      date?: string;
      sameStations?: string;
    } = {};

    // Validate form
    if (!searchCriteria.from) {
      errors.from = 'Please select a departure station';
    }

    if (!searchCriteria.to) {
      errors.to = 'Please select an arrival station';
    }

    if (searchCriteria.from && searchCriteria.to && searchCriteria.from.id === searchCriteria.to.id) {
      errors.sameStations = 'Departure and arrival stations cannot be the same';
    }

    if (!searchCriteria.date) {
      errors.date = 'Please select a travel date';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Clear any errors
    setFormErrors({});

    // Navigate to train list page
    navigate('/trains');
  };

  // Swap origin and destination stations
  const handleSwapStations = () => {
    if (searchCriteria.from && searchCriteria.to) {
      setSearchCriteria({
        ...searchCriteria,
        from: searchCriteria.to,
        to: searchCriteria.from
      });
      setFromSearchText(searchCriteria.to.name);
      setToSearchText(searchCriteria.from.name);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-blue-800 text-white px-6 py-6">
            <h1 className="text-2xl font-bold">Book Your Train Tickets</h1>
            <p className="text-blue-200 mt-2">Search for available trains and book your journey</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* From Station */}
                <div className="relative">
                  <label htmlFor="fromStation" className="block text-sm font-medium text-gray-700 mb-1">
                    From Station
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="fromStation"
                      type="text"
                      value={fromSearchText}
                      onChange={(e) => {
                        setFromSearchText(e.target.value);
                        setIsFromDropdownOpen(true);
                      }}
                      onFocus={() => setIsFromDropdownOpen(true)}
                      placeholder="Enter departure station"
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        formErrors.from || formErrors.sameStations ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  {isFromDropdownOpen && filteredFromStations.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm overflow-auto">
                      {filteredFromStations.map(station => (
                        <div
                          key={station.id}
                          className="cursor-pointer hover:bg-blue-50 px-4 py-2"
                          onClick={() => handleFromStationSelect(station)}
                        >
                          <div className="font-medium">{station.name}</div>
                          <div className="text-gray-500 text-xs">{station.code}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {formErrors.from && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.from}</p>
                  )}
                  {formErrors.sameStations && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.sameStations}</p>
                  )}
                </div>

                {/* To Station */}
                <div className="relative">
                  <label htmlFor="toStation" className="block text-sm font-medium text-gray-700 mb-1">
                    To Station
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="toStation"
                      type="text"
                      value={toSearchText}
                      onChange={(e) => {
                        setToSearchText(e.target.value);
                        setIsToDropdownOpen(true);
                      }}
                      onFocus={() => setIsToDropdownOpen(true)}
                      placeholder="Enter arrival station"
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        formErrors.to || formErrors.sameStations ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  {isToDropdownOpen && filteredToStations.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm overflow-auto">
                      {filteredToStations.map(station => (
                        <div
                          key={station.id}
                          className="cursor-pointer hover:bg-blue-50 px-4 py-2"
                          onClick={() => handleToStationSelect(station)}
                        >
                          <div className="font-medium">{station.name}</div>
                          <div className="text-gray-500 text-xs">{station.code}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {formErrors.to && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.to}</p>
                  )}
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -mt-3 mb-3">
                <button
                  type="button"
                  onClick={handleSwapStations}
                  className="bg-white border border-gray-300 rounded-full p-2 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M14.293 5.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-2 2a1 1 0 01-1.414-1.414L15.586 8l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M5.707 5.293a1 1 0 00-1.414 0l-2 2a1 1 0 000 1.414l2 2a1 1 0 001.414-1.414L4.414 8l1.293-1.293a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Date of Journey */}
                <div>
                  <label htmlFor="journeyDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Journey
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="journeyDate"
                      type="date"
                      min={today}
                      value={searchCriteria.date}
                      onChange={handleDateChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        formErrors.date ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  {formErrors.date && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
                  )}
                </div>

                {/* Class */}
                <div>
                  <label htmlFor="travelClass" className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={18} className="text-gray-400" />
                    </div>
                    <select
                      id="travelClass"
                      value={searchCriteria.class}
                      onChange={handleClassChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {trainClasses.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <span>Find Trains</span>
                  <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Quick Options */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div 
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <h3 className="font-semibold text-gray-900 mb-2">Check PNR Status</h3>
            <p className="text-sm text-gray-600">Track the status of your ticket</p>
          </motion.div>

          <motion.div 
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <h3 className="font-semibold text-gray-900 mb-2">Train Schedule</h3>
            <p className="text-sm text-gray-600">View complete train timetables</p>
          </motion.div>

          <motion.div 
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <h3 className="font-semibold text-gray-900 mb-2">Waiting List Status</h3>
            <p className="text-sm text-gray-600">Check your waiting list position</p>
          </motion.div>

          <motion.div 
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <h3 className="font-semibold text-gray-900 mb-2">Fare Enquiry</h3>
            <p className="text-sm text-gray-600">Check ticket fares between stations</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;