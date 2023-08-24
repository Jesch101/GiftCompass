import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import Home from '@/pages/Home';
import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import SignUp from '@/pages/SignUp';
import SignIn from '@/pages/SignIn';
import ErrorPageWrapper from './pages/ErrorPageWrapper';
import Profile from '@/pages/profile/Profile';
import PrivateRoutes from '@/utils/PrivateRoutes';

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <div className='relative flex min-h-screen flex-col'>
            <Header />
            <Routes>
              <Route
                path='/'
                element={<Home />}
              />
              <Route
                path='/signup'
                element={<SignUp />}
              />
              <Route
                path='/signin'
                element={<SignIn />}
              />
              <Route
                path='/error'
                element={<ErrorPageWrapper />}
              />
              <Route
                path='*'
                element={<Navigate to='/error' />}
              />
              <Route element={<PrivateRoutes />}>
                <Route
                  path='/profile'
                  element={<Profile />}
                />
              </Route>
            </Routes>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
