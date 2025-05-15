import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking, Seat } from '../contexts/BookingContext';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ChevronRight, Info, X } from 'lucide-react';

// Import Three.js components
import SeatModel from '../components/3d/SeatModel';
import CameraControls from '../components/3d/CameraControls';

// Mock data for seat layout
const generateMockSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const types = ['window', 'middle', 'aisle', 'upper', 'lower', 'side-upper', 'side-lower'];
  
  // Create sleeper coach layout
  for (let row = 1; row <= 9; row++) {
    // Lower berths
    seats.push({
      id: `${row}L`,
      number: `${row}L`,
      type: 'lower',
      isAvailable: Math.random() > 0.3,
      isLadiesOnly: row === 3 || row === 7,
      position: { x: row * 2, y: 0, z: 0 }
    });
    
    // Middle berths
    seats.push({
      id: `${row}M`,
      number: `${row}M`,
      type: 'middle',
      isAvailable: Math.random() > 0.3,
      isLadiesOnly: row === 3 || row === 7,
      position: { x: row * 2, y: 0.8, z: 0 }
    });
    
    // Upper berths
    seats.push({
      id: `${row}U`,
      number: `${row}U`,
      type: 'upper',
      isAvailable: Math.random() > 0.3,
      isLadiesOnly: false,
      position: { x: row * 2, y: 1.6, z: 0 }
    });
    
    // Side lower berths
    if (row % 3 === 0) {
      seats.push({
        id: `${row}SL`,
        number: `${row}SL`,
        type: 'side-lower',
        isAvailable: Math.random() > 0.3,
        isLadiesOnly: false,
        position: { x: row * 2, y: 0, z: 2 }
      });
      
      // Side upper berths
      seats.push({
        id: `${row}SU`,
        number: `${row}SU`,
        type: 'side-upper',
        isAvailable: Math.random() > 0.3,
        isLadiesOnly: false,
        position: { x: row * 2, y: 1.6, z: 2 }
      });
    }
  }
  
  return seats;
};

const SeatSelectionPage: React.FC = () => {
  const { trainId } = useParams<{ trainId: string }>();
  const { bookingDetails, addSelectedSeat, removeSelectedSeat } = useBooking();
  const navigate = useNavigate();
  
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [filters, setFilters] = useState<{
    seatTypes: string[];
    onlyAvailable: boolean;
    onlyLadies: boolean;
  }>({
    seatTypes: [],
    onlyAvailable: true,
    onlyLadies: false
  });
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  
  const popupRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!bookingDetails.train) {
      navigate('/trains');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to get seat layout
    setTimeout(() => {
      const mockSeats = generateMockSeats();
      setSeats(mockSeats);
      setIsLoading(false);
    }, 1000);
  }, [bookingDetails.train, navigate]);

  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return;
    
    setSelectedSeat(seat);
    setPopupOpen(true);
  };

  const handleSelectSeat = () => {
    if (selectedSeat) {
      const alreadySelected = bookingDetails.selectedSeats.find(s => s.id === selectedSeat.id);
      
      if (alreadySelected) {
        removeSelectedSeat(selectedSeat.id);
      } else {
        addSelectedSeat(selectedSeat);
      }
      
      setPopupOpen(false);
      setSelectedSeat(null);
    }
  };

  const handleFilterChange = (filter: keyof typeof filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };

  const handleSeatTypeFilter = (type: string) => {
    setFilters(prev => {
      const updatedTypes = prev.seatTypes.includes(type)
        ? prev.seatTypes.filter(t => t !== type)
        : [...prev.seatTypes, type];
      
      return {
        ...prev,
        seatTypes: updatedTypes
      };
    });
  };

  const filteredSeats = seats.filter(seat => {
    if (filters.onlyAvailable && !seat.isAvailable) return false;
    if (filters.onlyLadies && !seat.isLadiesOnly) return false;
    if (filters.seatTypes.length > 0 && !filters.seatTypes.includes(seat.type)) return false;
    return true;
  });

  const isSeatSelected = (seatId: string) => {
    return bookingDetails.selectedSeats.some(s => s.id === seatId);
  };

  const handleContinue = () => {
    if (bookingDetails.selectedSeats.length > 0) {
      navigate('/checkout');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Select Seats</h1>
              {bookingDetails.train && (
                <p className="text-gray-600 mt-1">
                  {bookingDetails.train.name} ({bookingDetails.train.number}) | 
                  {bookingDetails.selectedClass?.name}
                </p>
              )}
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back to Trains
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading seat layout...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters and Legend */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="bg-blue-800 text-white px-4 py-3">
                  <h2 className="font-semibold">Filters</h2>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seat Type</label>
                    <div className="space-y-2">
                      {['lower', 'middle', 'upper', 'side-lower', 'side-upper'].map(type => (
                        <label key={type} className="flex items-center">
                          <input 
                            type="checkbox"
                            checked={filters.seatTypes.includes(type)}
                            onChange={() => handleSeatTypeFilter(type)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">
                            {type.replace('-', ' ')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox"
                        checked={filters.onlyAvailable}
                        onChange={(e) => handleFilterChange('onlyAvailable', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show only available seats</span>
                    </label>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special</label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox"
                        checked={filters.onlyLadies}
                        onChange={(e) => handleFilterChange('onlyLadies', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show only ladies seats</span>
                    </label>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input 
                          type="radio"
                          checked={viewMode === '2d'}
                          onChange={() => setViewMode('2d')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">2D View</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio"
                          checked={viewMode === '3d'}
                          onChange={() => setViewMode('3d')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">3D View</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div 
                  className="bg-blue-800 text-white px-4 py-3 flex justify-between items-center cursor-pointer"
                  onClick={() => setIsLegendOpen(!isLegendOpen)}
                >
                  <h2 className="font-semibold">Seat Legend</h2>
                  {isLegendOpen ? <ChevronRight className="transform rotate-90" size={18} /> : <ChevronRight size={18} />}
                </div>
                {isLegendOpen && (
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-green-500 rounded mr-3"></div>
                        <span className="text-sm">Available</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-red-500 rounded mr-3"></div>
                        <span className="text-sm">Booked</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-blue-500 rounded mr-3"></div>
                        <span className="text-sm">Selected</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-purple-400 rounded mr-3"></div>
                        <span className="text-sm">Ladies</span>
                      </div>
                      <hr className="my-2" />
                      <h3 className="font-medium text-sm mb-1">Seat Types:</h3>
                      <div className="flex items-center">
                        <div className="w-6 h-6 text-center font-bold text-xs border border-gray-300 rounded mr-3">L</div>
                        <span className="text-sm">Lower Berth</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 text-center font-bold text-xs border border-gray-300 rounded mr-3">M</div>
                        <span className="text-sm">Middle Berth</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 text-center font-bold text-xs border border-gray-300 rounded mr-3">U</div>
                        <span className="text-sm">Upper Berth</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 text-center font-bold text-xs border border-gray-300 rounded mr-3">SL</div>
                        <span className="text-sm">Side Lower</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 text-center font-bold text-xs border border-gray-300 rounded mr-3">SU</div>
                        <span className="text-sm">Side Upper</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Seats */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-800 text-white px-4 py-3">
                  <h2 className="font-semibold">Selected Seats ({bookingDetails.selectedSeats.length})</h2>
                </div>
                <div className="p-4">
                  {bookingDetails.selectedSeats.length === 0 ? (
                    <p className="text-gray-500 text-sm">No seats selected yet</p>
                  ) : (
                    <div className="space-y-2">
                      {bookingDetails.selectedSeats.map(seat => (
                        <div key={seat.id} className="flex justify-between items-center bg-blue-50 p-2 rounded">
                          <div>
                            <span className="font-medium">{seat.number}</span>
                            <span className="text-xs text-gray-600 ml-2 capitalize">({seat.type.replace('-', ' ')})</span>
                          </div>
                          <button 
                            onClick={() => removeSelectedSeat(seat.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={handleContinue}
                          className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                          Continue to Checkout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Seat Layout */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-800 text-white px-4 py-3 flex justify-between items-center">
                  <h2 className="font-semibold">Seat Layout - Coach {bookingDetails.selectedClass?.type}</h2>
                  <button 
                    onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
                    className="text-white bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded text-sm"
                  >
                    Switch to {viewMode === '2d' ? '3D' : '2D'} View
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center text-gray-600">
                      <Info size={16} className="mr-1" />
                      <span className="text-sm">
                        Click on a seat to view details and book
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-blue-800 font-medium">
                        {filteredSeats.filter(s => s.isAvailable).length} seats available
                      </span>
                    </div>
                  </div>

                  {viewMode === '2d' ? (
                    <div className="overflow-x-auto">
                      <div className="min-w-max">
                        {/* 2D Layout */}
                        <div className="grid grid-cols-6 gap-4 p-4 border-2 border-gray-200 rounded-lg">
                          {/* Coach Front */}
                          <div className="col-span-6 bg-gray-100 p-2 text-center text-sm font-medium rounded">
                            Coach Front - Engine Side
                          </div>
                          
                          {/* Main Layout */}
                          <div className="col-span-2 grid grid-cols-3 gap-4">
                            {/* Lower Berths */}
                            {filteredSeats
                              .filter(seat => seat.type === 'lower')
                              .map(seat => (
                                <div
                                  key={seat.id}
                                  onClick={() => handleSeatClick(seat)}
                                  className={`p-3 rounded-md text-center transition-colors cursor-pointer ${
                                    !seat.isAvailable 
                                      ? 'bg-red-500 text-white'
                                      : isSeatSelected(seat.id)
                                        ? 'bg-blue-500 text-white'
                                        : seat.isLadiesOnly
                                          ? 'bg-purple-400 text-white'
                                          : 'bg-green-500 text-white hover:bg-green-600'
                                  }`}
                                >
                                  <div className="font-bold">{seat.number}</div>
                                  <div className="text-xs">Lower</div>
                                </div>
                              ))}
                          </div>
                          
                          <div className="col-span-2 grid grid-cols-3 gap-4">
                            {/* Middle Berths */}
                            {filteredSeats
                              .filter(seat => seat.type === 'middle')
                              .map(seat => (
                                <div
                                  key={seat.id}
                                  onClick={() => handleSeatClick(seat)}
                                  className={`p-3 rounded-md text-center transition-colors cursor-pointer ${
                                    !seat.isAvailable 
                                      ? 'bg-red-500 text-white'
                                      : isSeatSelected(seat.id)
                                        ? 'bg-blue-500 text-white'
                                        : seat.isLadiesOnly
                                          ? 'bg-purple-400 text-white'
                                          : 'bg-green-500 text-white hover:bg-green-600'
                                  }`}
                                >
                                  <div className="font-bold">{seat.number}</div>
                                  <div className="text-xs">Middle</div>
                                </div>
                              ))}
                          </div>
                          
                          <div className="col-span-2 grid grid-cols-3 gap-4">
                            {/* Upper Berths */}
                            {filteredSeats
                              .filter(seat => seat.type === 'upper')
                              .map(seat => (
                                <div
                                  key={seat.id}
                                  onClick={() => handleSeatClick(seat)}
                                  className={`p-3 rounded-md text-center transition-colors cursor-pointer ${
                                    !seat.isAvailable 
                                      ? 'bg-red-500 text-white'
                                      : isSeatSelected(seat.id)
                                        ? 'bg-blue-500 text-white'
                                        : seat.isLadiesOnly
                                          ? 'bg-purple-400 text-white'
                                          : 'bg-green-500 text-white hover:bg-green-600'
                                  }`}
                                >
                                  <div className="font-bold">{seat.number}</div>
                                  <div className="text-xs">Upper</div>
                                </div>
                              ))}
                          </div>
                          
                          {/* Aisle */}
                          <div className="col-span-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">Aisle / Walkway</span>
                          </div>
                          
                          {/* Side Berths */}
                          <div className="col-span-6 grid grid-cols-6 gap-4">
                            {filteredSeats
                              .filter(seat => seat.type === 'side-lower')
                              .map(seat => (
                                <div
                                  key={seat.id}
                                  onClick={() => handleSeatClick(seat)}
                                  className={`p-3 rounded-md text-center transition-colors cursor-pointer ${
                                    !seat.isAvailable 
                                      ? 'bg-red-500 text-white'
                                      : isSeatSelected(seat.id)
                                        ? 'bg-blue-500 text-white'
                                        : seat.isLadiesOnly
                                          ? 'bg-purple-400 text-white'
                                          : 'bg-green-500 text-white hover:bg-green-600'
                                  }`}
                                >
                                  <div className="font-bold">{seat.number}</div>
                                  <div className="text-xs">Side Lower</div>
                                </div>
                              ))}
                          </div>
                          
                          <div className="col-span-6 grid grid-cols-6 gap-4">
                            {filteredSeats
                              .filter(seat => seat.type === 'side-upper')
                              .map(seat => (
                                <div
                                  key={seat.id}
                                  onClick={() => handleSeatClick(seat)}
                                  className={`p-3 rounded-md text-center transition-colors cursor-pointer ${
                                    !seat.isAvailable 
                                      ? 'bg-red-500 text-white'
                                      : isSeatSelected(seat.id)
                                        ? 'bg-blue-500 text-white'
                                        : seat.isLadiesOnly
                                          ? 'bg-purple-400 text-white'
                                          : 'bg-green-500 text-white hover:bg-green-600'
                                  }`}
                                >
                                  <div className="font-bold">{seat.number}</div>
                                  <div className="text-xs">Side Upper</div>
                                </div>
                              ))}
                          </div>
                          
                          {/* Coach Rear */}
                          <div className="col-span-6 bg-gray-100 p-2 text-center text-sm font-medium rounded">
                            Coach Rear
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-96 border-2 border-gray-200 rounded-lg">
                      {/* 3D Canvas */}
                      <Canvas
                        camera={{ position: [0, 5, 10], fov: 75 }}
                        style={{ background: '#f3f4f6' }}
                      >
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1} />
                        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                        
                        {filteredSeats.map(seat => (
                          <SeatModel 
                            key={seat.id}
                            seat={seat}
                            isSelected={isSeatSelected(seat.id)}
                            onClick={() => handleSeatClick(seat)}
                          />
                        ))}
                        
                        <CameraControls />
                      </Canvas>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Seat Selection Popup */}
      <AnimatePresence>
        {popupOpen && selectedSeat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              ref={popupRef}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Seat Details</h2>
                  <button 
                    onClick={() => setPopupOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Seat Number:</span>
                    <span className="font-semibold">{selectedSeat.number}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold capitalize">{selectedSeat.type.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold ${selectedSeat.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedSeat.isAvailable ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  {selectedSeat.isLadiesOnly && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Special:</span>
                      <span className="font-semibold text-purple-600">Ladies Only</span>
                    </div>
                  )}
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Selected:</span>
                    <span className="font-semibold">
                      {isSeatSelected(selectedSeat.id) ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => setPopupOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSelectSeat}
                    className={`px-4 py-2 rounded-md text-white ${
                      isSeatSelected(selectedSeat.id)
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-800 hover:bg-blue-700'
                    }`}
                  >
                    {isSeatSelected(selectedSeat.id) ? 'Remove Selection' : 'Select Seat'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeatSelectionPage;