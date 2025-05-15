import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, MapPin, CreditCard, Shield, LogOut, Edit, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  gender: string;
  savedCards: {
    id: string;
    type: string;
    number: string;
    expiry: string;
  }[];
  preferences: {
    seatPreference: string;
    mealPreference: string;
    notificationPreference: string[];
  };
}

// Mock user profile data
const mockUserProfile: UserProfile = {
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@example.com',
  phone: '+91 9876543210',
  dob: '1990-05-15',
  address: '123 Railway Colony, New Delhi, 110001',
  gender: 'Male',
  savedCards: [
    {
      id: '1',
      type: 'Visa',
      number: '•••• •••• •••• 4567',
      expiry: '05/27'
    },
    {
      id: '2',
      type: 'MasterCard',
      number: '•••• •••• •••• 8901',
      expiry: '12/25'
    }
  ],
  preferences: {
    seatPreference: 'Window',
    mealPreference: 'Vegetarian',
    notificationPreference: ['email', 'sms']
  }
};

const UserProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [editMode, setEditMode] = useState<{
    personal: boolean;
    address: boolean;
    preferences: boolean;
  }>({
    personal: false,
    address: false,
    preferences: false
  });
  
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    dob: string;
    address: string;
    gender: string;
    seatPreference: string;
    mealPreference: string;
    notificationPreference: string[];
  }>({
    name: userProfile.name,
    phone: userProfile.phone,
    dob: userProfile.dob,
    address: userProfile.address,
    gender: userProfile.gender,
    seatPreference: userProfile.preferences.seatPreference,
    mealPreference: userProfile.preferences.mealPreference,
    notificationPreference: userProfile.preferences.notificationPreference
  });
  
  const handleEditToggle = (section: keyof typeof editMode) => {
    setEditMode(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    
    // Reset form data if cancelling edit
    if (editMode[section]) {
      setFormData({
        name: userProfile.name,
        phone: userProfile.phone,
        dob: userProfile.dob,
        address: userProfile.address,
        gender: userProfile.gender,
        seatPreference: userProfile.preferences.seatPreference,
        mealPreference: userProfile.preferences.mealPreference,
        notificationPreference: userProfile.preferences.notificationPreference
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (value: string) => {
    setFormData(prev => {
      const currentPreferences = [...prev.notificationPreference];
      
      if (currentPreferences.includes(value)) {
        return {
          ...prev,
          notificationPreference: currentPreferences.filter(pref => pref !== value)
        };
      } else {
        return {
          ...prev,
          notificationPreference: [...currentPreferences, value]
        };
      }
    });
  };
  
  const handleSavePersonal = () => {
    setUserProfile(prev => ({
      ...prev,
      name: formData.name,
      phone: formData.phone,
      dob: formData.dob,
      gender: formData.gender
    }));
    
    setEditMode(prev => ({
      ...prev,
      personal: false
    }));
  };
  
  const handleSaveAddress = () => {
    setUserProfile(prev => ({
      ...prev,
      address: formData.address
    }));
    
    setEditMode(prev => ({
      ...prev,
      address: false
    }));
  };
  
  const handleSavePreferences = () => {
    setUserProfile(prev => ({
      ...prev,
      preferences: {
        seatPreference: formData.seatPreference,
        mealPreference: formData.mealPreference,
        notificationPreference: formData.notificationPreference
      }
    }));
    
    setEditMode(prev => ({
      ...prev,
      preferences: false
    }));
  };
  
  const handleRemoveCard = (cardId: string) => {
    setUserProfile(prev => ({
      ...prev,
      savedCards: prev.savedCards.filter(card => card.id !== cardId)
    }));
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-xl font-bold">
                {userProfile.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-gray-900">{userProfile.name}</h1>
                <p className="text-gray-600">{userProfile.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 md:mt-0 flex items-center text-red-600 hover:text-red-800"
            >
              <LogOut size={18} className="mr-1" />
              Logout
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Information */}
          <motion.div 
            className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-blue-800 text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <User size={18} className="mr-2" />
                <h2 className="font-semibold">Personal Information</h2>
              </div>
              <button 
                onClick={() => handleEditToggle('personal')}
                className="text-white hover:text-blue-200"
              >
                {editMode.personal ? <X size={18} /> : <Edit size={18} />}
              </button>
            </div>
            
            <div className="p-4">
              {editMode.personal ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleEditToggle('personal')}
                      className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSavePersonal}
                      className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <User size={16} className="mt-0.5 text-gray-500 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Full Name</h3>
                      <p className="text-gray-900">{userProfile.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail size={16} className="mt-0.5 text-gray-500 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Email Address</h3>
                      <p className="text-gray-900">{userProfile.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone size={16} className="mt-0.5 text-gray-500 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Phone Number</h3>
                      <p className="text-gray-900">{userProfile.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar size={16} className="mt-0.5 text-gray-500 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Date of Birth</h3>
                      <p className="text-gray-900">
                        {new Date(userProfile.dob).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <User size={16} className="mt-0.5 text-gray-500 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Gender</h3>
                      <p className="text-gray-900">{userProfile.gender}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Saved Payment Methods */}
          <motion.div 
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="bg-blue-800 text-white px-4 py-3">
              <div className="flex items-center">
                <CreditCard size={18} className="mr-2" />
                <h2 className="font-semibold">Saved Payment Methods</h2>
              </div>
            </div>
            
            <div className="p-4">
              {userProfile.savedCards.length === 0 ? (
                <p className="text-gray-500 text-sm">No saved payment methods</p>
              ) : (
                <div className="space-y-4">
                  {userProfile.savedCards.map(card => (
                    <div key={card.id} className="border border-gray-200 rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{card.type}</p>
                          <p className="text-sm text-gray-600">{card.number}</p>
                          <p className="text-xs text-gray-500 mt-1">Expires: {card.expiry}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveCard(card.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded-md py-2 hover:bg-blue-50 transition-colors">
                    + Add New Card
                  </button>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Address Information */}
          <motion.div 
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="bg-blue-800 text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <MapPin size={18} className="mr-2" />
                <h2 className="font-semibold">Address</h2>
              </div>
              <button 
                onClick={() => handleEditToggle('address')}
                className="text-white hover:text-blue-200"
              >
                {editMode.address ? <X size={18} /> : <Edit size={18} />}
              </button>
            </div>
            
            <div className="p-4">
              {editMode.address ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={4}
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleEditToggle('address')}
                      className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAddress}
                      className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start">
                  <MapPin size={16} className="mt-0.5 text-gray-500 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Address</h3>
                    <p className="text-gray-900">{userProfile.address}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Preferences */}
          <motion.div 
            className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="bg-blue-800 text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <Shield size={18} className="mr-2" />
                <h2 className="font-semibold">Preferences</h2>
              </div>
              <button 
                onClick={() => handleEditToggle('preferences')}
                className="text-white hover:text-blue-200"
              >
                {editMode.preferences ? <X size={18} /> : <Edit size={18} />}
              </button>
            </div>
            
            <div className="p-4">
              {editMode.preferences ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="seatPreference" className="block text-sm font-medium text-gray-700 mb-1">
                      Seat Preference
                    </label>
                    <select
                      id="seatPreference"
                      name="seatPreference"
                      value={formData.seatPreference}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Window">Window</option>
                      <option value="Aisle">Aisle</option>
                      <option value="Middle">Middle</option>
                      <option value="Lower">Lower Berth</option>
                      <option value="Upper">Upper Berth</option>
                      <option value="No Preference">No Preference</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="mealPreference" className="block text-sm font-medium text-gray-700 mb-1">
                      Meal Preference
                    </label>
                    <select
                      id="mealPreference"
                      name="mealPreference"
                      value={formData.mealPreference}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="No Preference">No Preference</option>
                    </select>
                  </div>
                  
                  <div>
                    <p className="block text-sm font-medium text-gray-700 mb-1">
                      Notification Preferences
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input 
                          type="checkbox"
                          checked={formData.notificationPreference.includes('email')}
                          onChange={() => handleCheckboxChange('email')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Email</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox"
                          checked={formData.notificationPreference.includes('sms')}
                          onChange={() => handleCheckboxChange('sms')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">SMS</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox"
                          checked={formData.notificationPreference.includes('push')}
                          onChange={() => handleCheckboxChange('push')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Push Notifications</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleEditToggle('preferences')}
                      className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSavePreferences}
                      className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Shield size={16} className="mt-0.5 text-gray-500 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">Seat Preference</h3>
                        <p className="text-gray-900">{userProfile.preferences.seatPreference}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Shield size={16} className="mt-0.5 text-gray-500 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">Meal Preference</h3>
                        <p className="text-gray-900">{userProfile.preferences.mealPreference}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <Shield size={16} className="mt-0.5 text-gray-500 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">Notification Preferences</h3>
                        <div className="mt-1">
                          {userProfile.preferences.notificationPreference.map(pref => (
                            <div key={pref} className="flex items-center mb-1">
                              <Check size={14} className="text-green-600 mr-1" />
                              <span className="text-gray-900 capitalize">{pref}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;