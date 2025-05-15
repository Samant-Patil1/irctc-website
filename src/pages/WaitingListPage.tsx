import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, RefreshCw, AlertCircle } from 'lucide-react';

interface WaitingTicket {
  pnrNumber: string;
  trainNumber: string;
  trainName: string;
  journeyDate: string;
  from: string;
  to: string;
  waitingNumber: number;
  status: 'confirmed' | 'rac' | 'waiting';
  passengers: {
    name: string;
    age: number;
    currentStatus: string;
  }[];
}

const mockWaitingTickets: WaitingTicket[] = [
  {
    pnrNumber: '4235621897',
    trainNumber: '12301',
    trainName: 'Rajdhani Express',
    journeyDate: '2025-05-01',
    from: 'New Delhi',
    to: 'Mumbai Central',
    waitingNumber: 5,
    status: 'waiting',
    passengers: [
      { name: 'Amit Kumar', age: 32, currentStatus: 'WL/5' },
      { name: 'Priya Kumar', age: 28, currentStatus: 'WL/6' }
    ]
  },
  {
    pnrNumber: '7892345016',
    trainNumber: '12259',
    trainName: 'Duronto Express',
    journeyDate: '2025-05-03',
    from: 'New Delhi',
    to: 'Kolkata Howrah',
    waitingNumber: 2,
    status: 'rac',
    passengers: [
      { name: 'Rahul Singh', age: 45, currentStatus: 'RAC/2' }
    ]
  },
  {
    pnrNumber: '3452109876',
    trainNumber: '12953',
    trainName: 'August Kranti Express',
    journeyDate: '2025-05-05',
    from: 'Mumbai Central',
    to: 'New Delhi',
    waitingNumber: 12,
    status: 'waiting',
    passengers: [
      { name: 'Neha Sharma', age: 29, currentStatus: 'WL/12' },
      { name: 'Rohit Sharma', age: 32, currentStatus: 'WL/13' },
      { name: 'Aarav Sharma', age: 8, currentStatus: 'WL/14' }
    ]
  },
  {
    pnrNumber: '9876543210',
    trainNumber: '12909',
    trainName: 'Garib Rath Express',
    journeyDate: '2025-04-30',
    from: 'Bangalore City',
    to: 'New Delhi',
    waitingNumber: 1,
    status: 'confirmed',
    passengers: [
      { name: 'Rajesh Khanna', age: 55, currentStatus: 'Confirmed (S4, 16)' },
      { name: 'Sunita Khanna', age: 50, currentStatus: 'Confirmed (S4, 17)' }
    ]
  }
];

const WaitingListPage: React.FC = () => {
  const [pnrNumber, setPnrNumber] = useState('');
  const [searchResults, setSearchResults] = useState<WaitingTicket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAllTickets, setShowAllTickets] = useState(true);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API call
    setTimeout(() => {
      if (pnrNumber) {
        const results = mockWaitingTickets.filter(
          ticket => ticket.pnrNumber.includes(pnrNumber)
        );
        setSearchResults(results);
        setShowAllTickets(false);
      } else {
        setSearchResults([]);
        setShowAllTickets(true);
      }
      setIsLoading(false);
    }, 1000);
  };
  
  const refreshStatus = (pnrNumber: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, this would update the ticket status from the server
      alert(`Refreshed status for PNR ${pnrNumber}`);
    }, 1000);
  };
  
  const getStatusColor = (status: string) => {
    if (status.startsWith('Confirmed')) return 'text-green-600';
    if (status.startsWith('RAC')) return 'text-orange-600';
    return 'text-red-600';
  };
  
  const getStatusBadgeColor = (status: WaitingTicket['status']) => {
    if (status === 'confirmed') return 'bg-green-100 text-green-800';
    if (status === 'rac') return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };
  
  const displayTickets = showAllTickets ? mockWaitingTickets : searchResults;
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h1 className="text-xl font-bold text-gray-900">Check Waiting List Status</h1>
          <p className="text-gray-600 mt-1">
            Enter your PNR number to check the current status of your waiting list ticket
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search Form */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-blue-800 text-white px-4 py-3">
                <h2 className="font-semibold">Search Ticket</h2>
              </div>
              <div className="p-4">
                <form onSubmit={handleSearch}>
                  <div className="mb-4">
                    <label htmlFor="pnrNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      PNR Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="pnrNumber"
                        type="text"
                        value={pnrNumber}
                        onChange={(e) => setPnrNumber(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter PNR number"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Searching...
                      </>
                    ) : (
                      'Check Status'
                    )}
                  </button>
                  
                  {hasSearched && !isLoading && !showAllTickets && (
                    <button
                      type="button"
                      onClick={() => {
                        setPnrNumber('');
                        setShowAllTickets(true);
                      }}
                      className="w-full mt-2 text-blue-600 text-sm hover:text-blue-800"
                    >
                      Show all tickets
                    </button>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
          
          {/* Results */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
                <p className="mt-4 text-gray-600">Checking ticket status...</p>
              </div>
            ) : displayTickets.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                  <AlertCircle size={48} className="text-blue-800" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Tickets Found</h3>
                <p className="text-gray-600">
                  {hasSearched 
                    ? `No tickets found for PNR number "${pnrNumber}". Please check the PNR number and try again.`
                    : 'You have no waiting list tickets. Book a ticket first or check your PNR number.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayTickets.map((ticket) => (
                  <motion.div 
                    key={ticket.pnrNumber}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-blue-50 p-4 border-b border-blue-100">
                      <div className="flex flex-wrap justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-bold text-gray-900">{ticket.trainName}</h3>
                            <span className="ml-2 text-sm text-gray-600">#{ticket.trainNumber}</span>
                            <span className={`ml-3 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(ticket.status)}`}>
                              {ticket.status === 'confirmed' 
                                ? 'Confirmed' 
                                : ticket.status === 'rac' 
                                  ? 'RAC' 
                                  : 'Waiting'}
                            </span>
                          </div>
                          <div className="flex items-center mt-1 text-sm text-gray-600">
                            <Calendar size={14} className="mr-1" />
                            <span>
                              Journey Date: {new Date(ticket.journeyDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">PNR:</span> {ticket.pnrNumber}
                          </div>
                          <button
                            onClick={() => refreshStatus(ticket.pnrNumber)}
                            className="mt-1 flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <RefreshCw size={14} className="mr-1" />
                            Refresh Status
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-start md:items-center">
                          <div className="text-center mr-6">
                            <p className="text-sm font-bold text-gray-900">{ticket.from}</p>
                          </div>
                          <div className="flex flex-col items-center mx-2">
                            <div className="w-2 h-2 rounded-full bg-blue-800"></div>
                            <div className="w-16 md:w-24 border-t border-dashed border-gray-400 my-1"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-800"></div>
                          </div>
                          <div className="text-center ml-6">
                            <p className="text-sm font-bold text-gray-900">{ticket.to}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-800 mb-2">Passenger Details</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
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
                                  Current Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {ticket.passengers.map((passenger, index) => (
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
                                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusColor(passenger.currentStatus)}`}>
                                    {passenger.currentStatus}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      {ticket.status === 'waiting' && (
                        <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-md p-3">
                          <p className="text-sm text-yellow-800">
                            Your ticket is on waiting list position {ticket.waitingNumber}. You will be notified if your ticket gets confirmed.
                          </p>
                        </div>
                      )}
                      
                      {ticket.status === 'rac' && (
                        <div className="mt-4 bg-orange-50 border border-orange-100 rounded-md p-3">
                          <p className="text-sm text-orange-800">
                            Your ticket is in RAC (Reservation Against Cancellation). You can board the train with this ticket, but you may have to share a berth.
                          </p>
                        </div>
                      )}
                      
                      {ticket.status === 'confirmed' && (
                        <div className="mt-4 bg-green-50 border border-green-100 rounded-md p-3">
                          <p className="text-sm text-green-800">
                            Congratulations! Your ticket has been confirmed. You can check the assigned seats in the passenger details.
                          </p>
                        </div>
                      )}
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

export default WaitingListPage;