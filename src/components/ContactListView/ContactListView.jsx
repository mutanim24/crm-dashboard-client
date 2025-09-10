import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addContact } from '../../store/contactSlice';
import Button from '../Button/Button';
import Input from '../Input/Input';
import Modal from '../Modal/Modal';
import ContactForm from '../ContactForm/ContactForm';
import toast from 'react-hot-toast';

// --- UI Sub-components (for a cleaner structure, placed within the main component) ---

const EmptyState = ({ searchTerm }) => (
  <div className="text-center py-20 px-6 border-2 border-dashed border-gray-200 rounded-lg">
    {/* Users Icon SVG */}
    <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" />
    </svg>
    <h3 className="mt-2 text-lg font-semibold text-gray-900">
      {searchTerm ? 'No contacts match your search' : 'No contacts yet'}
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      {searchTerm ? 'Try a different search term.' : 'Get started by adding a new contact.'}
    </p>
  </div>
);


const ContactListView = ({ contacts }) => {
  // --- All state and functionality remains unchanged ---
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const dispatch = useDispatch();

  const contactsArray = Array.isArray(contacts) ? contacts : [];

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
    const contactData = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      phone: formValues.phone,
      company: formValues.company,
      tags: formValues.tags || []
    };

    toast.promise(
      dispatch(addContact(contactData)).unwrap(),
      {
        loading: 'Creating contact...',
        success: () => {
          setShowCreateModal(false);
          return 'Contact created successfully!';
        },
        error: (err) => {
          const errorMessage = err.message || 'Failed to create contact';
          setCreateError(errorMessage);
          return errorMessage;
        },
      }
    ).finally(() => {
      setIsCreating(false);
    });
  };

  // --- Redesigned UI Starts Here ---

  return (
    // Main container with a softer shadow
    <div className="bg-white rounded-lg shadow-sm">
      {/* Redesigned Header */}
      <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/70 rounded-t-lg border-b border-gray-200">
        <div className="relative w-full sm:max-w-xs">
          {/* Search Icon SVG */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <Input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10" // Padding for the icon
          />
        </div>

        <Button
  onClick={() => setShowCreateModal(true)}
  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 
             bg-green-600 text-white rounded-2xl shadow-md 
             hover:bg-green-700 hover:shadow-lg 
             transition-all duration-200 ease-in-out"
>
  {/* Plus Icon */}
  <svg
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 
             000 1.5h4.5v4.5a.75.75 0 
             001.5 0v-4.5h4.5a.75.75 0 
             000-1.5h-4.5v-4.5z" />
  </svg>
  Add Contact
</Button>


      </div>

      {/* Conditional Rendering for Table or Empty State */}
      {filteredContacts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Company</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Phone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50/60 transition-colors duration-150 group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/contacts/${contact.id}`} className="flex items-center group-hover:no-underline">
                      <div className="flex-shrink-0 h-10 w-10">
                        <span className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                          {((contact.firstName?.[0] || '') + (contact.lastName?.[0] || '')).toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-primary">
                          {`${contact.firstName || ''} ${contact.lastName || ''}`.trim()}
                        </div>
                        {contact.title && <div className="text-sm text-gray-500">{contact.title}</div>}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">{contact.company || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">{contact.email || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">{contact.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contact.tags?.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {contact.tags.slice(0, 3).map((tagJoin, index) => (
                          <span key={tagJoin.id || index} className="px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{tagJoin.tag?.name || '...'}</span>
                        ))}
                        {contact.tags.length > 3 && <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">+{contact.tags.length - 3}</span>}
                      </div>
                    ) : (<span className="text-sm text-gray-400">-</span>)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-gray-400 hover:text-gray-600 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Ellipsis Vertical Icon SVG */}
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState searchTerm={searchTerm} />
      )}

      {/* Modal remains unchanged */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Contact" size="lg">
        <ContactForm onSubmit={handleCreateContact} isLoading={isCreating} error={createError} />
      </Modal>
    </div>
  );
};

export default ContactListView;