import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Maintenance from './Maintenance';
import Hygiene from './Hygiene';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <nav>
          <Link to="/">Daily Apartment Maintenance</Link>
          <Link to="/hygiene">Daily Hygiene and Self-Care</Link>
        </nav>
        <Routes>
          <Route exact path="/" element={<Maintenance />} />
          <Route path="/hygiene" element={<Hygiene />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;