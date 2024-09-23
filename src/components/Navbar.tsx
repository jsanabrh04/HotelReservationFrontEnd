// src/components/Navbar.tsx
import { Button, ButtonGroup } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';


const Navbar: React.FC<{ role: string, className?: string }> = ({ role, className }) => {
  const navigate = useNavigate();
  

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleReservations = () => {
    navigate('/reservations');
  };

  const handleHome = () => {
    navigate('/home');
  };

  const handleAddHotel = () => {
    navigate('/add-hotel');
  };

  return (
    <nav className={className}>
      <ButtonGroup variant="outlined" aria-label="Loading button group">
      <Button onClick={handleHome}>Inicio</Button>
      <Button onClick={handleReservations}>Reservas</Button>
      {role === 'admin' && <Button onClick={handleAddHotel}>Agregar Hotel</Button>}
      <Button onClick={handleLogout}>Cerrar Sesión</Button>
      </ButtonGroup>
    </nav>
  );
};

export default Navbar;
