// src/pages/contacts/ContactsPage.jsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import { fetchContacts } from '../../store/contactSlice';
import ContactListView from '../../components/ContactListView/ContactListView';
import Button from '../../components/Button/Button'; // Assuming you have a Button component

const ContactsPage = () => {
  const dispatch = useDispatch();
  
  const { contacts, loading, error } = useSelector((state) => state.contacts);
  
  // Fetch contacts when component mounts (Functionality is unchanged)
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);
  
  // --- Redesigned Loading State ---
  if (loading && contacts.length === 0) {
    return (
      <div className="flex-1 bg-gray-50/50 flex flex-col justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg text-gray-600">Loading Contacts...</p>
        <p className="text-sm text-gray-500">Please wait a moment.</p>
      </div>
    );
  }
  
  // --- Redesigned Error State ---
  if (error) {
    return (
      <div className="flex-1 bg-gray-50/50 flex justify-center items-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-800 p-8 rounded-lg shadow-sm max-w-md text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Failed to Load Contacts</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }
  
  // --- Redesigned Main View ---
  return (
    <div className="flex-1 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Redesigned Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Contacts</h1>
                <p className="mt-1 text-gray-500">Manage your entire contact database.</p>
            </div>
            
        </div>
        
        {/* ContactListView remains unchanged, as requested */}
        <ContactListView 
          contacts={contacts} 
        />
      </div>
    </div>
  );
};

export default ContactsPage;
