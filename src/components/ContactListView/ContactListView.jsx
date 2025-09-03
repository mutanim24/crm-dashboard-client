import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addContact } from '../../store/contactSlice';
import Button from '../Button/Button';
import Input from '../Input/Input';
import Modal from '../Modal/Modal';
import ContactForm from '../ContactForm/ContactForm';
import toast from 'react-hot-toast';

const ContactListView = ({ contacts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  
  const dispatch = useDispatch();
  
  // Ensure contacts is an array
  const contactsArray = Array.isArray(contacts) ? contacts : [];
  
  // Filter contacts based on search term
  const filteredContacts = contactsArray.filter(contact => {
    const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contact.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleCreateContact = async (formValues) => {
    setIsCreating(true);
    setCreateError(null);
    
    // Transform formValues to extract tag IDs
    const contactData = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      phone: formValues.phone,
      company: formValues.company,
      // ✅ Convert tag strings into IDs (assuming tags are currently strings)
      // Note: This assumes the backend will create new tags if they don't exist
      // If the backend expects existing tag IDs, this logic may need adjustment
      tags: formValues.tags || []
    };
    
    toast.promise(
      (async () => {
        await dispatch(addContact(contactData)).unwrap();
        setShowCreateModal(false);
      })(),
      {
        loading: 'Creating contact...',
        success: 'Contact created successfully!',
        error: (err) => {
          // The error from the thunk is in err.message
          const errorMessage = err.message || 'Failed to create contact';
          setCreateError(errorMessage);
          return errorMessage;
        },
      }
    ).finally(() => {
      setIsCreating(false);
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header with search and create button */}
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <Button
          text="Add Contact"
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </Button>
      </div>
      
      {/* Contacts table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Company
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Phone
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchTerm ? 'No contacts match your search' : 'No contacts found'}
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr 
                  key={contact.id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/contacts/${contact.id}`}
                      className="flex items-center hover:no-underline"
                    >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                          {`${contact.firstName || ''} ${contact.lastName || ''}`.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {`${contact.firstName || ''} ${contact.lastName || ''}`.trim()}
                        </div>
                        {contact.title && (
                          <div className="text-sm text-gray-500">
                            {contact.title}
                          </div>
                        )}
                      </div>
                    </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {contact.company || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {contact.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {contact.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contact.tags && contact.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.slice(0, 3).map((tagJoin, index) => (
                          <span
                            key={tagJoin.id || index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tagJoin.tag?.name || 'Unknown Tag'}
                          </span>
                        ))}
                        {contact.tags.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{contact.tags.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Create Contact Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Contact"
        size="lg"
      >
        <ContactForm
          onSubmit={handleCreateContact}
          isLoading={isCreating}
          error={createError}
        />
      </Modal>
    </div>
  );
};

export default ContactListView;
