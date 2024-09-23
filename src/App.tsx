// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import AddHotel from './pages/AddHotel/AddHotel';
import Reservation from './pages/Reservations/Reservations';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/add-hotel" element={<AddHotel />} />
        <Route path="/reservations" element={<Reservation />} />
      </Routes>
    </Router>
  );
};

export default App;
