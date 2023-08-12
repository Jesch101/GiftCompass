import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Router>
        <div className='relative flex min-h-screen flex-col'>
          <Header />
          <Routes>
            <Route
              path='/'
              element={<Home />}
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
