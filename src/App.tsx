import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContex';
import Home from './pages/home/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import SignUp from './pages/home/SignUp';
import SignIn from './pages/home/SignIn';

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
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
