import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Home from './pages/home/Home';
import Navbar from './components/navbar/Navbar';
import rootStyles from './themes/styles';
import theme from './themes/theme';

function App() {
  return (
    <>
      <Router>
        <div style={rootStyles}>
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
