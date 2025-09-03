
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './store/authSlice';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import ContactsPage from './pages/Contacts/ContactsPage';
import ContactDetailPage from './pages/ContactDetail/ContactDetailPage';
import PipelinePage from './pages/Pipelines/PipelinePage';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import WorkflowPage from './pages/Workflows/WorkflowPage';
import WorkflowCanvasPage from './pages/Workflows/WorkflowCanvasPage';
import Settings from './pages/Settings/Settings';
import TemplatesPage from './pages/Settings/TemplatesPage';
import IntegrationsPage from './pages/Settings/IntegrationsPage';
import WebhookSimulatorPage from './pages/Developer/WebhookSimulatorPage';
import ProfilePage from './pages/Profile/ProfilePage';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const dispatch = useDispatch();

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem('auth');
        if (authData) {
          const { user, token } = JSON.parse(authData);
          if (user && token) {
            // Dispatch loginSuccess with stored user and token
            dispatch(loginSuccess({ user, token }));
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // If there's an error with localStorage, clear it
        localStorage.removeItem('auth');
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar isOpen={false} setIsOpen={() => {}} />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                      <Dashboard />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/contacts" 
            element={
              <PrivateRoute>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar isOpen={false} setIsOpen={() => {}} />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                      <ContactsPage />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/contacts/:id" 
            element={
              <PrivateRoute>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar isOpen={false} setIsOpen={() => {}} />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                      <ContactDetailPage />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/pipelines" 
            element={
              <PrivateRoute>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar isOpen={false} setIsOpen={() => {}} />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                      <PipelinePage />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/workflows" 
            element={
              <PrivateRoute>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar isOpen={false} setIsOpen={() => {}} />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                      <WorkflowPage />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/workflows/new" 
            element={
              <PrivateRoute>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar isOpen={false} setIsOpen={() => {}} />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                      <WorkflowCanvasPage />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/workflows/:id" 
            element={
              <PrivateRoute>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar isOpen={false} setIsOpen={() => {}} />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                      <WorkflowCanvasPage />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <PrivateRoute>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar isOpen={false} setIsOpen={() => {}} />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                      <Settings />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/settings/templates" 
            element={
              <PrivateRoute>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar isOpen={false} setIsOpen={() => {}} />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                      <TemplatesPage />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/settings/integrations" 
            element={
              <PrivateRoute>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar isOpen={false} setIsOpen={() => {}} />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                      <IntegrationsPage />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/dev/webhook-simulator" 
            element={
              <PrivateRoute>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar isOpen={false} setIsOpen={() => {}} />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                      <WebhookSimulatorPage />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar isOpen={false} setIsOpen={() => {}} />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                      <ProfilePage />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            } 
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
