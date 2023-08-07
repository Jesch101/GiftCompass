import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Navbar from './components/Navbar';
import rootStyles from './themes/styles';

function App() {
  return (
    <>
      <Router>
        <div style={rootStyles}>
          <Navbar />
          <Routes>
            <Route
              path='/'
              element={<Home />}
            />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
