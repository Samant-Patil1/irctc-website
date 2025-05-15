import React, { createContext, useState, useContext } from 'react';

export interface Station {
  id: string;
  name: string;
  code: string;
}

export interface Train {
  id: string;
  name: string;
  number: string;
  departureStation: Station;
  arrivalStation: Station;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: TrainClass[];
}

export interface TrainClass {
  id: string;
  type: string;
  name: string;
  fare: number;
  availableSeats: number;
}

export interface Seat {
  id: string;
  number: string;
  type: 'window' | 'middle' | 'aisle' | 'upper' | 'lower' | 'side-upper' | 'side-lower';
  isAvailable: boolean;
  isLadiesOnly: boolean;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export interface Passenger {
  name: string;
  age: number;
  aadhaarId: string;
}

export interface BookingDetails {
  train: Train | null;
  selectedClass: TrainClass | null;
  selectedSeats: Seat[];
  departureDate: string;
  passengers: Passenger[];
  totalFare: number;
}

interface BookingContextType {
  searchCriteria: {
    from: Station | null;
    to: Station | null;
    date: string;
    class: string;
  };
  bookingDetails: BookingDetails;
  setSearchCriteria: (criteria: {
    from: Station | null;
    to: Station | null;
    date: string;
    class: string;
  }) => void;
  setSelectedTrain: (train: Train | null) => void;
  setSelectedClass: (trainClass: TrainClass | null) => void;
  addSelectedSeat: (seat: Seat) => void;
  removeSelectedSeat: (seatId: string) => void;
  updatePassengers: (passengers: Passenger[]) => void;
  clearBooking: () => void;
  calculateTotalFare: () => number;
}

const initialBookingDetails: BookingDetails = {
  train: null,
  selectedClass: null,
  selectedSeats: [],
  departureDate: '',
  passengers: [],
  totalFare: 0
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchCriteria, setSearchCriteria] = useState<{
    from: Station | null;
    to: Station | null;
    date: string;
    class: string;
  }>({
    from: null,
    to: null,
    date: new Date().toISOString().split('T')[0],
    class: 'all'
  });

  const [bookingDetails, setBookingDetails] = useState<BookingDetails>(initialBookingDetails);

  const setSelectedTrain = (train: Train | null) => {
    setBookingDetails(prev => ({
      ...prev,
      train,
      selectedClass: null,
      selectedSeats: [],
      departureDate: searchCriteria.date
    }));
  };

  const setSelectedClass = (trainClass: TrainClass | null) => {
    setBookingDetails(prev => ({
      ...prev,
      selectedClass: trainClass,
      selectedSeats: []
    }));
  };

  const addSelectedSeat = (seat: Seat) => {
    setBookingDetails(prev => ({
      ...prev,
      selectedSeats: [...prev.selectedSeats, seat]
    }));
  };

  const removeSelectedSeat = (seatId: string) => {
    setBookingDetails(prev => ({
      ...prev,
      selectedSeats: prev.selectedSeats.filter(seat => seat.id !== seatId)
    }));
  };

  const updatePassengers = (passengers: Passenger[]) => {
    setBookingDetails(prev => ({
      ...prev,
      passengers
    }));
  };

  const clearBooking = () => {
    setBookingDetails(initialBookingDetails);
  };

  const calculateTotalFare = () => {
    const baseFare = bookingDetails.selectedClass?.fare || 0;
    const totalFare = baseFare * bookingDetails.selectedSeats.length;
    return totalFare;
  };

  const value = {
    searchCriteria,
    bookingDetails,
    setSearchCriteria,
    setSelectedTrain,
    setSelectedClass,
    addSelectedSeat,
    removeSelectedSeat,
    updatePassengers,
    clearBooking,
    calculateTotalFare
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};