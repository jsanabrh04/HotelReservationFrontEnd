import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { Grid, Paper, Typography } from '@mui/material';

interface Hotel {
  hotelId: number;
  name: string;
  location: string;
  description: string;
}

const HomePage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [role, setRole] = useState<string>('');

  const fetchHotels = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const response = await axios.get('http://localhost:5432/hotels/findAllHotels', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHotels(response.data);
      } else {
        console.error('No token found');
      }
    } catch (error) {
      console.error('Error fetching hotels', error);
    }
  };

  const fetchUserRole = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchUserRole();
  }, []);

  return (
    <div>
      <Navbar role={role} />
      <h1>Hoteles</h1>
      <Grid container spacing={3} alignItems="center">
      {hotels.map((hotel) => (
        <Grid item key={hotel.hotelId} xs={12} sm={6} md={4} lg={3}>
          <Paper elevation={3} style={{ padding: '20px', height: '100%' }}>
            <Typography variant="h6">{hotel.name}</Typography>
            <Typography variant="body2">{hotel.location}</Typography>
            <Typography variant="body1">{hotel.description}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
    </div>
  );
};

export default HomePage;
