import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, Filter, ChevronDown, ChevronUp, ArrowRight, Tag, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBooking, Train, TrainClass } from '../contexts/BookingContext';
import { format, addDays, subDays, parseISO } from 'date-fns';

// Mock data for trains
const generateMockTrains = (from: string, to: string, date: string): Train[] => {
  const trains: Train[] = [
    {
      id: '1',
      name: 'Rajdhani Express',
      number: '12301',
      departureStation: { id: from, name: 'New Delhi', code: 'NDLS' },
      arrivalStation: { id: to, name: 'Mumbai Central', code: 'MMCT' },
      departureTime: '16:25',
      arrivalTime: '08:15',
      duration: '15h 50m',
      classes: [
        { id: 'SL', type: 'SL', name: 'Sleeper Class', fare: 745, availableSeats: 126 },
        { id: '3A', type: '3A', name: 'AC 3 Tier', fare: 1965, availableSeats: 64 },
        { id: '2A', type: '2A', name: 'AC 2 Tier', fare: 2860, availableSeats: 28 },
        { id: '1A', type: '1A', name: 'AC First Class', fare: 4850, availableSeats: 3 }
      ]
    },
    {
      id: '2',
      name: 'Duronto Express',
      number: '12259',
      departureStation: { id: from, name: 'New Delhi', code: 'NDLS' },
      arrivalStation: { id: to, name: 'Mumbai Central', code: 'MMCT' },
      departureTime: '11:00',
      arrivalTime: '04:25',
      duration: '17h 25m',
      classes: [
        { id: 'SL', type: 'SL', name: 'Sleeper Class', fare: 720, availableSeats: 0 },
        { id: '3A', type: '3A', name: 'AC 3 Tier', fare: 1890, availableSeats: 12 },
        { id: '2A', type: '2A', name: 'AC 2 Tier', fare: 2750, availableSeats: 0 }
      ]
    },
    {
      id: '3',
      name: 'Garib Rath Express',
      number: '12909',
      departureStation: { id: from, name: 'New Delhi', code: 'NDLS' },
      arrivalStation: { id: to, name: 'Mumbai Central', code: 'MMCT' },
      departureTime: '15:35',
      arrivalTime: '09:10',
      duration: '17h 35m',
      classes: [
        { id: '3A', type: '3A', name: 'AC 3 Tier', fare: 1245, availableSeats: 87 },
      ]
    },
    {
      id: '4',
      name: 'August Kranti Express',
      number: '12953',
      departureStation: { id: from, name: 'New Delhi', code: 'NDLS' },
      arrivalStation: { id: to, name: 'Mumbai Central', code: 'MMCT' },
      departureTime: '17:40',
      arrivalTime: '10:55',
      duration: '17h 15m',
      classes: [
        { id: 'SL', type: 'SL', name: 'Sleeper Class', fare: 765, availableSeats: 145 },
        { id: '3A', type: '3A', name: 'AC 3 Tier', fare: 2050, availableSeats: 54 },
        { id: '2A', type: '2A', name: 'AC 2 Tier', fare: 2950, availableSeats: 6 },
        { id: '1A', type: '1A', name: 'AC First Class', fare: 5100, availableSeats: 0 }
      ]
    },
    {
      id: '5',
      name: 'Sampark Kranti Express',
      number: '12908',
      departureStation: { id: from, name: 'New Delhi', code: 'NDLS' },
      arrivalStation: { id: to, name: 'Mumbai Central', code: 'MMCT' },
      departureTime: '07:20',
      arrivalTime: '00:45',
      duration: '17h 25m',
      classes: [
        { id: 'SL', type: 'SL', name: 'Sleeper Class', fare: 740, availableSeats: 194 },
        { id: '3A', type: '3A', name: 'AC 3 Tier', fare: 1935, availableSeats: 76 },
        { id: '2A', type: '2A', name: 'AC 2 Tier', fare: 2810, availableSeats: 42 }
      ]
    }
  ];

  return trains;
};

const TrainListPage: React.FC = () => {
  const { searchCriteria, setSelectedTrain } = useBooking();
  const navigate = useNavigate();
  
  const [trains, setTrains] = useState<Train[]>([]);
  const [filteredTrains, setFilteredTrains] = useState<Train[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(searchCriteria.date);
  
  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [departureTimeFilter, setDepartureTimeFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('departure');
  
  const departureTimeRanges = [
    { id: 'morning', label: 'Morning (06:00 - 12:00)', start: '06:00', end: '12:00' },
    { id: 'afternoon', label: 'Afternoon (12:00 - 18:00)', start: '12:00', end: '18:00' },
    { id: 'evening', label: 'Evening (18:00 - 00:00)', start: '18:00', end: '00:00' },
    { id: 'night', label: 'Night (00:00 - 06:00)', start: '00:00', end: '06:00' }
  ];

  // Fetch train data
  useEffect(() => {
    if (!searchCriteria.from || !searchCriteria.to) {
      navigate('/booking');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockTrains = generateMockTrains(
        searchCriteria.from.id,
        searchCriteria.to.id,
        currentDate
      );
      setTrains(mockTrains);
      setFilteredTrains(mockTrains);
      setIsLoading(false);
    }, 1000);
  }, [searchCriteria.from, searchCriteria.to, currentDate, navigate]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...trains];

    // Apply class filter
    if (selectedClasses.length > 0) {
      result = result.filter(train => 
        train.classes.some(cls => selectedClasses.includes(cls.type))
      );
    }

    // Apply departure time filter
    if (departureTimeFilter.length > 0) {
      result = result.filter(train => {
        const [hours, minutes] = train.departureTime.split(':').map(Number);
        const departureMinutes = hours * 60 + minutes;

        return departureTimeFilter.some(filterId => {
          const range = departureTimeRanges.find(r => r.id === filterId);
          if (!range) return false;

          const [startHours, startMinutes] = range.start.split(':').map(Number);
          const [endHours, endMinutes] = range.end.split(':').map(Number);
          
          const startInMinutes = startHours * 60 + startMinutes;
          const endInMinutes = endHours * 60 + endMinutes;

          if (endInMinutes < startInMinutes) {
            // Handle overnight ranges (e.g., 22:00 - 06:00)
            return departureMinutes >= startInMinutes || departureMinutes <= endInMinutes;
          } else {
            return departureMinutes >= startInMinutes && departureMinutes <= endInMinutes;
          }
        });
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'departure') {
        const [aHours, aMinutes] = a.departureTime.split(':').map(Number);
        const [bHours, bMinutes] = b.departureTime.split(':').map(Number);
        return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
      } else if (sortBy === 'duration') {
        const aDuration = a.duration.includes('h') 
          ? parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1].replace('m', ''))
          : parseInt(a.duration.replace('m', ''));
        const bDuration = b.duration.includes('h')
          ? parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1].replace('m', ''))
          : parseInt(b.duration.replace('m', ''));
        return aDuration - bDuration;
      } else if (sortBy === 'fare') {
        const aMinFare = Math.min(...a.classes.map(cls => cls.fare));
        const bMinFare = Math.min(...b.classes.map(cls => cls.fare));
        return aMinFare - bMinFare;
      }
      return 0;
    });

    setFilteredTrains(result);
  }, [trains, selectedClasses, departureTimeFilter, sortBy]);

  const handleClassFilterChange = (classType: string) => {
    setSelectedClasses(prev => 
      prev.includes(classType)
        ? prev.filter(c => c !== classType)
        : [...prev, classType]
    );
  };

  const handleTimeFilterChange = (timeRange: string) => {
    setDepartureTimeFilter(prev => 
      prev.includes(timeRange)
        ? prev.filter(t => t !== timeRange)
        : [...prev, timeRange]
    );
  };

  const handleClearFilters = () => {
    setSelectedClasses([]);
    setDepartureTimeFilter([]);
    setSortBy('departure');
  };

  const handleTrainSelect = (train: Train, trainClass: TrainClass) => {
    setSelectedTrain(train);
    navigate(`/seat-selection/${train.id}`);
  };

  const handleDateChange = (daysToAdd: number) => {
    const date = parseISO(currentDate);
    const newDate = daysToAdd > 0 ? addDays(date, daysToAdd) : subDays(date, Math.abs(daysToAdd));
    setCurrentDate(format(newDate, 'yyyy-MM-dd'));
  };

  const formatDisplayDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'EEE, dd MMM yyyy');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with search details */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  {searchCriteria.from?.name} <ArrowRight size={20} className="inline mx-2" /> {searchCriteria.to?.name}
                </h1>
              </div>
              <div className="flex items-center text-gray-600 mt-1">
                <Calendar size={16} className="mr-1" />
                <span>{formatDisplayDate(currentDate)}</span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center">
              <button 
                onClick={() => handleDateChange(-1)}
                className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Previous Day
              </button>
              <button 
                onClick={() => handleDateChange(1)}
                className="ml-2 px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Next Day
              </button>
              <button 
                onClick={() => navigate('/booking')}
                className="ml-4 px-3 py-1 bg-blue-800 text-white rounded-md hover:bg-blue-700"
              >
                Modify Search
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 cursor-pointer bg-blue-800 text-white"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <div className="flex items-center">
                  <Filter size={18} className="mr-2" />
                  <h2 className="font-semibold">Filters</h2>
                </div>
                <div className="lg:hidden">
                  {isFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              <div className={`p-4 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                {/* Travel Class */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Travel Class</h3>
                  <div className="space-y-2">
                    {['SL', '3A', '2A', '1A', 'CC', 'EC'].map(cls => (
                      <label key={cls} className="flex items-center">
                        <input 
                          type="checkbox"
                          checked={selectedClasses.includes(cls)}
                          onChange={() => handleClassFilterChange(cls)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {cls === 'SL' ? 'Sleeper Class' : 
                           cls === '3A' ? 'AC 3 Tier' : 
                           cls === '2A' ? 'AC 2 Tier' : 
                           cls === '1A' ? 'AC First Class' : 
                           cls === 'CC' ? 'Chair Car' : 'Executive Class'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Departure Time */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Departure Time</h3>
                  <div className="space-y-2">
                    {departureTimeRanges.map(range => (
                      <label key={range.id} className="flex items-center">
                        <input 
                          type="checkbox"
                          checked={departureTimeFilter.includes(range.id)}
                          onChange={() => handleTimeFilterChange(range.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Sort By</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="radio"
                        checked={sortBy === 'departure'}
                        onChange={() => setSortBy('departure')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Departure Time</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio"
                        checked={sortBy === 'duration'}
                        onChange={() => setSortBy('duration')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Duration</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio"
                        checked={sortBy === 'fare'}
                        onChange={() => setSortBy('fare')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Fare</span>
                    </label>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedClasses.length > 0 || departureTimeFilter.length > 0 || sortBy !== 'departure') && (
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <X size={16} className="mr-1" />
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Train List */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading available trains...</p>
              </div>
            ) : filteredTrains.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">No trains found for your search criteria. Please try different dates or stations.</p>
                <button 
                  onClick={() => navigate('/booking')}
                  className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700"
                >
                  Modify Search
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTrains.map(train => (
                  <motion.div 
                    key={train.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">{train.name}</h2>
                          <p className="text-sm text-gray-600">Train #{train.number}</p>
                        </div>
                        <div className="flex items-center mt-2 md:mt-0">
                          <Tag size={16} className="text-blue-800 mr-1" />
                          <span className="text-sm text-blue-800">
                            Fares from ₹{Math.min(...train.classes.map(c => c.fare))}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-start md:items-center">
                          <div className="text-center mr-6">
                            <p className="text-xl font-bold text-gray-900">{train.departureTime}</p>
                            <p className="text-xs text-gray-600">{train.departureStation.code}</p>
                          </div>
                          <div className="flex flex-col items-center mx-2">
                            <div className="w-2 h-2 rounded-full bg-blue-800"></div>
                            <div className="h-12 border-l border-dashed border-gray-400 my-1"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-800"></div>
                          </div>
                          <div className="text-center ml-6">
                            <p className="text-xl font-bold text-gray-900">{train.arrivalTime}</p>
                            <p className="text-xs text-gray-600">{train.arrivalStation.code}</p>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center">
                          <Clock size={16} className="text-gray-500 mr-1" />
                          <span className="text-gray-700">{train.duration}</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Available Classes</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {train.classes.map(cls => (
                            <div 
                              key={cls.id}
                              className={`border rounded-md p-3 ${
                                cls.availableSeats > 0 
                                  ? 'cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors'
                                  : 'bg-gray-50 opacity-70'
                              }`}
                              onClick={() => cls.availableSeats > 0 && handleTrainSelect(train, cls)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900">{cls.name}</p>
                                  <p className="text-sm text-gray-600">₹{cls.fare}</p>
                                </div>
                                <div className={`text-sm ${
                                  cls.availableSeats === 0 
                                    ? 'text-red-600' 
                                    : cls.availableSeats < 10 
                                      ? 'text-orange-600'
                                      : 'text-green-600'
                                }`}>
                                  {cls.availableSeats === 0 
                                    ? 'Not Available' 
                                    : `${cls.availableSeats} available`}
                                </div>
                              </div>
                              {cls.availableSeats > 0 && (
                                <button 
                                  className="mt-2 w-full text-sm bg-blue-800 text-white py-1 rounded hover:bg-blue-700 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTrainSelect(train, cls);
                                  }}
                                >
                                  Select Seats
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainListPage;