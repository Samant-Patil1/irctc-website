import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooking, Passenger } from '../contexts/BookingContext';
import { ChevronRight, CreditCard, User, Calendar, Check, X } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const { bookingDetails, updatePassengers, calculateTotalFare, clearBooking } = useBooking();
  const navigate = useNavigate();
  
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('upi');
  
  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: 'https://img.icons8.com/color/48/000000/bhim.png' },
    { id: 'card', name: 'Credit/Debit Card', icon: 'https://img.icons8.com/color/48/000000/visa.png' },
    { id: 'netbanking', name: 'Net Banking', icon: 'https://img.icons8.com/color/48/000000/bank-building.png' },
    { id: 'wallet', name: 'Wallets', icon: 'https://img.icons8.com/color/48/000000/wallet--v1.png' }
  ];
  
  // Base fare calculation
  const totalFare = calculateTotalFare();
  const taxes = Math.round(totalFare * 0.05); // 5% tax
  const convenienceFee = 20 * bookingDetails.selectedSeats.length;
  const totalAmount = totalFare + taxes + convenienceFee;
  
  useEffect(() => {
    if (!bookingDetails.train || !bookingDetails.selectedClass || bookingDetails.selectedSeats.length === 0) {
      navigate('/booking');
      return;
    }
    
    // Initialize passenger array based on selected seats
    const initialPassengers = bookingDetails.selectedSeats.map(() => ({
      name: '',
      age: 0,
      aadhaarId: ''
    }));
    
    setPassengers(initialPassengers);
  }, [bookingDetails, navigate]);
  
  const handlePassengerChange = (index: number, field: keyof Passenger, value: string | number) => {
    const newPassengers = [...passengers];
    newPassengers[index] = {
      ...newPassengers[index],
      [field]: value
    };
    
    setPassengers(newPassengers);
    
    // Clear error for this field if it exists
    if (errors[`passenger${index}_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`passenger${index}_${field}`];
      setErrors(newErrors);
    }
  };
  
  const validatePassengers = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;
    
    passengers.forEach((passenger, index) => {
      if (!passenger.name.trim()) {
        newErrors[`passenger${index}_name`] = 'Name is required';
        isValid = false;
      }
      
      if (!passenger.age || passenger.age < 1 || passenger.age > 120) {
        newErrors[`passenger${index}_age`] = 'Valid age is required (1-120)';
        isValid = false;
      }
      
      if (!passenger.aadhaarId.trim() || passenger.aadhaarId.length !== 12 || !/^\d+$/.test(passenger.aadhaarId)) {
        newErrors[`passenger${index}_aadhaarId`] = 'Valid 12-digit Aadhaar ID is required';
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleContinue = () => {
    if (currentStep === 1) {
      if (validatePassengers()) {
        updatePassengers(passengers);
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      // Handle payment (mock)
      setIsConfirming(true);
      setTimeout(() => {
        // Simulate successful payment
        // In real app, you would integrate with a payment gateway
        clearBooking();
        navigate('/journeys');
      }, 2000);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Complete Your Booking</h1>
              {bookingDetails.train && (
                <p className="text-gray-600 mt-1">
                  {bookingDetails.train.name} ({bookingDetails.train.number}) | 
                  {bookingDetails.selectedClass?.name}
                </p>
              )}
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-blue-800 text-white' : 'bg-gray-300 text-gray-500'
                }`}>
                  <User size={16} />
                </div>
                <div className={`w-12 h-1 ${
                  currentStep >= 2 ? 'bg-blue-800' : 'bg-gray-300'
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-blue-800 text-white' : 'bg-gray-300 text-gray-500'
                }`}>
                  <CreditCard size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Passenger Details / Payment Form */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 ? (
                <>
                  <div className="bg-blue-800 text-white px-4 py-3">
                    <h2 className="font-semibold">Passenger Details</h2>
                  </div>
                  <div className="p-4">
                    {passengers.map((passenger, index) => (
                      <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
                        <h3 className="font-medium text-gray-800 mb-3">
                          Passenger {index + 1} - Seat {bookingDetails.selectedSeats[index]?.number}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor={`passenger${index}_name`} className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <input
                              id={`passenger${index}_name`}
                              type="text"
                              value={passenger.name}
                              onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                              className={`block w-full px-3 py-2 border ${
                                errors[`passenger${index}_name`] ? 'border-red-300' : 'border-gray-300'
                              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                              placeholder="Enter full name as per ID"
                            />
                            {errors[`passenger${index}_name`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`passenger${index}_name`]}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor={`passenger${index}_age`} className="block text-sm font-medium text-gray-700 mb-1">
                              Age
                            </label>
                            <input
                              id={`passenger${index}_age`}
                              type="number"
                              min="1"
                              max="120"
                              value={passenger.age || ''}
                              onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value) || 0)}
                              className={`block w-full px-3 py-2 border ${
                                errors[`passenger${index}_age`] ? 'border-red-300' : 'border-gray-300'
                              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                              placeholder="Enter age"
                            />
                            {errors[`passenger${index}_age`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`passenger${index}_age`]}</p>
                            )}
                          </div>
                          
                          <div className="md:col-span-2">
                            <label htmlFor={`passenger${index}_aadhaarId`} className="block text-sm font-medium text-gray-700 mb-1">
                              Aadhaar ID
                            </label>
                            <input
                              id={`passenger${index}_aadhaarId`}
                              type="text"
                              maxLength={12}
                              value={passenger.aadhaarId}
                              onChange={(e) => handlePassengerChange(index, 'aadhaarId', e.target.value)}
                              className={`block w-full px-3 py-2 border ${
                                errors[`passenger${index}_aadhaarId`] ? 'border-red-300' : 'border-gray-300'
                              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                              placeholder="Enter 12-digit Aadhaar number"
                            />
                            {errors[`passenger${index}_aadhaarId`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`passenger${index}_aadhaarId`]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-blue-800 text-white px-4 py-3">
                    <h2 className="font-semibold">Payment Method</h2>
                  </div>
                  <div className="p-4">
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-800 mb-3">
                        Select a payment method
                      </h3>
                      
                      <div className="space-y-3">
                        {paymentMethods.map(method => (
                          <label 
                            key={method.id}
                            className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                              selectedPaymentMethod === method.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={selectedPaymentMethod === method.id}
                              onChange={() => setSelectedPaymentMethod(method.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <div className="flex items-center ml-3">
                              <img src={method.icon} alt={method.name} className="w-8 h-8 mr-3" />
                              <span className="font-medium">{method.name}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {selectedPaymentMethod === 'upi' && (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-800 mb-2">UPI Payment</h4>
                        <div className="mb-4">
                          <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                            UPI ID
                          </label>
                          <input
                            id="upiId"
                            type="text"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="username@bankname"
                          />
                        </div>
                        <div className="flex items-center">
                          <img 
                            src="https://img.icons8.com/color/48/000000/qr-code.png" 
                            alt="QR Code" 
                            className="w-24 h-24 mr-4" 
                          />
                          <div>
                            <p className="text-sm text-gray-600">Scan this QR code with any UPI app to pay</p>
                            <p className="text-xs text-gray-500 mt-1">Supported apps: PhonePe, Google Pay, Paytm, BHIM</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedPaymentMethod === 'card' && (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-800 mb-2">Card Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              Card Number
                            </label>
                            <input
                              id="cardNumber"
                              type="text"
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="1234 5678 9012 3456"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry Date
                            </label>
                            <input
                              id="expiryDate"
                              type="text"
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="MM/YY"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                              CVV
                            </label>
                            <input
                              id="cvv"
                              type="text"
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="123"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
                              Name on Card
                            </label>
                            <input
                              id="nameOnCard"
                              type="text"
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Other payment methods UI would go here */}
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="bg-blue-800 text-white px-4 py-3">
                <h2 className="font-semibold">Booking Summary</h2>
              </div>
              <div className="p-4">
                {bookingDetails.train && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-2">{bookingDetails.train.name}</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Train Number:</span>
                      <span>{bookingDetails.train.number}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Journey Date:</span>
                      <span>{bookingDetails.departureDate}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">From:</span>
                      <span>{bookingDetails.train.departureStation.name}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">To:</span>
                      <span>{bookingDetails.train.arrivalStation.name}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Class:</span>
                      <span>{bookingDetails.selectedClass?.name}</span>
                    </div>
                  </div>
                )}
                
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">Seats</h3>
                  <div className="space-y-1">
                    {bookingDetails.selectedSeats.map((seat, index) => (
                      <div key={seat.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">Seat {index + 1}:</span>
                        <span>{seat.number} ({seat.type.replace('-', ' ')})</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-800 mb-2">Price Details</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Fare ({bookingDetails.selectedSeats.length} seats):</span>
                    <span>₹{totalFare}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Taxes:</span>
                    <span>₹{taxes}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Convenience Fee:</span>
                    <span>₹{convenienceFee}</span>
                  </div>
                  <div className="flex justify-between font-semibold mt-3 pt-3 border-t border-gray-200">
                    <span>Total Amount:</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleContinue}
                  disabled={isConfirming}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                    isConfirming ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isConfirming ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : currentStep === 1 ? (
                    <>
                      Continue to Payment
                      <ChevronRight size={18} className="ml-1" />
                    </>
                  ) : (
                    <>
                      Make Payment
                      <ChevronRight size={18} className="ml-1" />
                    </>
                  )}
                </button>
                
                {currentStep === 2 && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 p-3 rounded-md">
                    <p className="text-xs text-blue-700">
                      This is a demo application. No actual payment will be processed.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;