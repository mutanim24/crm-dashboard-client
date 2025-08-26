import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contactService';

// Async thunks (These are correct and do not need changes)
export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async () => {
  const response = await getContacts();
  return response;
});

export const fetchContactById = createAsyncThunk('contacts/fetchContactById', async (id) => {
  const response = await getContactById(id);
  return response;
});

export const addContact = createAsyncThunk('contacts/addContact', async (contactData) => {
  const response = await createContact(contactData);
  return response;
});

export const editContact = createAsyncThunk('contacts/editContact', async ({ id, contactData }, { rejectWithValue }) => {
  try {
    const response = await updateContact(id, contactData);
    // The API returns { success: true, data: { contact } }
    return response.data;
  } catch (error) {
    console.error('Edit contact error:', error);
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const removeContact = createAsyncThunk('contacts/removeContact', async (id, { rejectWithValue }) => {
  try {
    await deleteContact(id);
    return id; // Manually return the ID to ensure the promise is fulfilled
  } catch (error) {
    console.error('Delete contact error:', error);
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const initialState = {
  contacts: [],
  selectedContact: null,
  loading: false,
  error: null,
};

const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setSelectedContact: (state, action) => {
      state.selectedContact = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedContact: (state) => {
      state.selectedContact = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch contacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        // The API response from contactService returns response.data
        // If the API returns { contacts: [...] }, extract the array
        // If the API returns the array directly, use it as is
        state.contacts = action.payload.contacts || action.payload.data || action.payload || [];
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Fetch contact by ID
      .addCase(fetchContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        state.loading = false;
        // The API response has a nested data property: { success: true, data: { contact } }
        state.selectedContact = action.payload.data;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        state.selectedContact = null; // Clear any old data
      })
      
      // Add contact
      .addCase(addContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.loading = false;
        // The API response from contactService returns response.data
        // The backend returns { success: true, data: { contact } }
        const newContact = action.payload.data?.contact || action.payload.data || action.payload;
        if (newContact) {
          // Add the new contact to the beginning of the array
          state.contacts.unshift(newContact);
        }
      })
      .addCase(addContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Edit contact
      .addCase(editContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(editContact.fulfilled, (state, action) => {
        state.loading = false;
        // The API response from contactService returns response.data
        // If the API returns { success: true, data: { contact } }, extract the contact
        const updatedContact = action.payload?.contact || action.payload?.data || action.payload;
        if (updatedContact) {
          const index = state.contacts.findIndex(contact => contact.id === updatedContact.id);
          if (index !== -1) {
            state.contacts[index] = updatedContact;
          }
          if (state.selectedContact && state.selectedContact.id === updatedContact.id) {
            state.selectedContact = updatedContact;
          }
        }
      })
      .addCase(editContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      
      // Delete contact
      .addCase(removeContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
        if (state.selectedContact && state.selectedContact.id === action.payload) {
          state.selectedContact = null;
        }
      })
      .addCase(removeContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedContact, clearError, clearSelectedContact } = contactSlice.actions;
export default contactSlice.reducer;
