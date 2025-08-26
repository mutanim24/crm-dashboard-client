import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContacts } from '../../store/contactSlice';
import ContactListView from '../../components/ContactListView/ContactListView';

const ContactsPage = () => {
  const dispatch = useDispatch();
  
  const { contacts, loading, error } = useSelector((state) => state.contacts);
  
  // Fetch contacts when component mounts
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);
  
  if (loading && contacts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading contacts...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
        Error loading contacts: {error}
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600">Manage your customer contacts and their information</p>
        </div>
        
        <ContactListView 
          contacts={contacts} 
        />
      </div>
    </div>
  );
};

export default ContactsPage;
