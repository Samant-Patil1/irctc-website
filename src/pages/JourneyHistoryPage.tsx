import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Download, Filter, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Journey {
  id: string;
  pnrNumber: string;
  trainNumber: string;
  trainName: string;
  journeyDate: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  ticketClass: string;
  amount: number;
  passengers: {
    name: string;
    age: number;
    seat?: string;
  }[];
}

const mockJourneys: Journey[] = [
  {
    id: '1',
    pnrNumber: '4235621897',
    trainNumber: '12301',
    trainName: 'Rajdhani Express',
    journeyDate: '2025-04-05',
    from: 'New Delhi',
    to: 'Mumbai Central',
    departureTime: '16:25',
    arrivalTime: '08:15',
    status: 'completed',
    ticketClass: 'AC 3 Tier',
    amount: 1965,
    passengers: [
      { name: 'Amit Kumar', age: 32, seat: 'B1, 32' },
      { name: 'Priya Kumar', age: 28, seat: 'B1, 33' }
    ]
  },
  {
    id: '2',
    pnrNumber: '7892345016',
    trainNumber: '12259',
    trainName: 'Duronto Express',
    journeyDate: '2025-05-15',
    from: 'New Delhi',
    to: 'Kolkata Howrah',
    departureTime: '11:00',
    arrivalTime: '04:25',
    status: 'upcoming',
    ticketClass: 'AC 2 Tier',
    amount: 2750,
    passengers: [
      { name: 'Rahul Singh', age: 45, seat: 'A3, 15' }
    ]
  },
  {
    id: '3',
    pnrNumber: '3452109876',
    trainNumber: '12953',
    trainName: 'August Kranti Express',
    journeyDate: '2025-03-10',
    from: 'Mumbai Central',
    to: 'New Delhi',
    departureTime: '17:40',
    arrivalTime: '10:55',
    status: 'completed',
    ticketClass: 'AC First Class',
    amount: 5100,
    passengers: [
      { name: 'Neha Sharma', age: 29, seat: 'H1, 4' },
      { name: 'Rohit Sharma', age: 32, seat: 'H1, 5' },
      { name: 'Aarav Sharma', age: 8, seat: 'H1, 6' }
    ]
  },
  {
    id: '4',
    pnrNumber: '9876543210',
    trainNumber: '12909',
    trainName: 'Garib Rath Express',
    journeyDate: '2025-02-20',
    from: 'Bangalore City',
    to: 'New Delhi',
    departureTime: '15:35',
    arrivalTime: '09:10',
    status: 'cancelled',
    ticketClass: 'AC 3 Tier',
    amount: 1245,
    passengers: [
      { name: 'Rajesh Khanna', age: 55 },
      { name: 'Sunita Khanna', age: 50 }
    ]
  },
  {
    id: '5',
    pnrNumber: '6543217890',
    trainNumber: '12908',
    trainName: 'Sampark Kranti Express',
    journeyDate: '2025-06-01',
    from: 'New Delhi',
    to: 'Mumbai Central',
    departureTime: '07:20',
    arrivalTime: '00:45',
    status: 'upcoming',
    ticketClass: 'Sleeper Class',
    amount: 740,
    passengers: [
      { name: 'Vikram Patel', age: 40, seat: 'S5, 42' },
      { name: 'Meera Patel', age: 38, seat: 'S5, 43' },
      { name: 'Arjun Patel', age: 12, seat: 'S5, 44' }
    ]
  }
];

const JourneyHistoryPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'upcoming' | 'cancelled'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedJourney, setExpandedJourney] = useState<string | null>(null);
  
  const filteredJourneys = mockJourneys
    .filter(journey => statusFilter === 'all' || journey.status === statusFilter)
    .sort((a, b) => {
      const dateA = new Date(a.journeyDate);
      const dateB = new Date(b.journeyDate);
      return sortOrder === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });
  
  const toggleJourneyDetails = (journeyId: string) => {
    setExpandedJourney(expandedJourney === journeyId ? null : journeyId);
  };
  
  const getStatusColor = (status: Journey['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatJourneyDate = (dateString: string) => {
    return format(parseISO(dateString), 'EEE, dd MMM yyyy');
  };
  
  const handleDownloadTicket = (pnrNumber: string) => {
    // Mock function to download ticket
    alert(`Downloading ticket for PNR ${pnrNumber}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h1 className="text-xl font-bold text-gray-900">My Incredible Journeys</h1>
          <p className="text-gray-600 mt-1">
            View all your past, current, and upcoming train journeys
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div 
            className="bg-blue-800 text-white px-4 py-3 flex justify-between items-center cursor-pointer"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <div className="flex items-center">
              <Filter size={18} className="mr-2" />
              <h2 className="font-semibold">Filter & Sort</h2>
            </div>
            {isFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {isFilterOpen && (
            <div className="p-4 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Journey Status</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusFilter === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                      onClick={() => setStatusFilter('all')}
                    >
                      All Journeys
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusFilter === 'upcoming' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                      onClick={() => setStatusFilter('upcoming')}
                    >
                      Upcoming
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusFilter === 'completed' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                      onClick={() => setStatusFilter('completed')}
                    >
                      Completed
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusFilter === 'cancelled' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                      onClick={() => setStatusFilter('cancelled')}
                    >
                      Cancelled
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        sortOrder === 'newest' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                      onClick={() => setSortOrder('newest')}
                    >
                      Newest First
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        sortOrder === 'oldest' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                      onClick={() => setSortOrder('oldest')}
                    >
                      Oldest First
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {filteredJourneys.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle size={48} className="text-blue-800" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Journeys Found</h3>
            <p className="text-gray-600 mb-4">
              {statusFilter !== 'all' 
                ? `You don't have any ${statusFilter} journeys.`
                : 'You haven\'t made any train journeys yet.'}
            </p>
            <Link 
              to="/booking" 
              className="inline-block bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Book Your First Journey
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJourneys.map((journey) => (
              <motion.div 
                key={journey.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className={`p-4 ${journey.status === 'cancelled' ? 'opacity-70' : ''}`}
                  onClick={() => toggleJourneyDetails(journey.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-bold text-gray-900">{journey.trainName}</h3>
                        <span className="ml-2 text-sm text-gray-600">#{journey.trainNumber}</span>
                        <span className={`ml-3 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(journey.status)}`}>
                          {journey.status.charAt(0).toUpperCase() + journey.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Calendar size={14} className="mr-1" />
                        <span>
                          Journey Date: {formatJourneyDate(journey.journeyDate)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center">
                      <div className="text-sm text-gray-700 mr-3">
                        <span className="font-medium">PNR:</span> {journey.pnrNumber}
                      </div>
                      <button className="text-gray-500">
                        {expandedJourney === journey.id ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-start md:items-center">
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900">{journey.departureTime}</p>
                        <p className="text-xs text-gray-600">{journey.from}</p>
                      </div>
                      <div className="flex flex-col items-center mx-3">
                        <div className="w-2 h-2 rounded-full bg-blue-800"></div>
                        <div className="w-12 md:w-24 border-t border-dashed border-gray-400 my-1"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-800"></div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900">{journey.arrivalTime}</p>
                        <p className="text-xs text-gray-600">{journey.to}</p>
                      </div>
                    </div>
                    <div className="mt-3 md:mt-0">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-900">{journey.ticketClass}</span>
                        <span className="text-sm text-gray-600">₹{journey.amount}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {expandedJourney === journey.id && (
                  <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                    <div className="py-3">
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Passenger Details</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                No.
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Age
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Seat
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {journey.passengers.map((passenger, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {passenger.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {passenger.age}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {journey.status === 'cancelled' 
                                    ? 'Cancelled' 
                                    : passenger.seat || 'Not assigned yet'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4 border-t border-gray-200 pt-4">
                      {journey.status !== 'cancelled' && (
                        <button
                          onClick={() => handleDownloadTicket(journey.pnrNumber)}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Download size={16} className="mr-1" />
                          Download E-Ticket
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneyHistoryPage;