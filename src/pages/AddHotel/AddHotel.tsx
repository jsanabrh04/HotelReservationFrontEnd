// AddHotel.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Button, TextField } from '@mui/material';
import styles from '../../styles/addHotelStyle.module.css'

interface AddHotelProps {
  onSuccess?: () => void;
}

const getRoleFromToken = (): string | null => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return null;
  }

  const payloadBase64 = token.split('.')[1];
  if (!payloadBase64) {
    return null;
  }

  const payload = JSON.parse(atob(payloadBase64));

  return payload.role || null;
};

const AddHotel: React.FC<AddHotelProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const role = getRoleFromToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5432/hotels/createHotel',
        { name, location, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (onSuccess) {
        onSuccess();
      }

      navigate('/home');
    } catch (error) {
      console.error('Error creating hotel', error);
    }
  };

  return (

<div className={styles.page}>
<Navbar role={role || ''} className={styles.navbar}/>
  <h1>Agregar Hotel</h1>
  <div className={styles.container}>

    <form onSubmit={handleSubmit} className={styles.formHotel}>
      <TextField
        type="text"
        value={name}
        margin="normal"
        fullWidth
        size="small"
        onChange={(e) => setName(e.target.value)}
        label="Nombre"
        required
      />
      <TextField
        type="text"
        value={location}
        margin="normal"
        fullWidth
        size="small"
        onChange={(e) => setLocation(e.target.value)}
        label="Locacion"
        required
      />
      <TextField
        type="text"
        value={description}
        margin="normal"
        fullWidth
        size="small"
        onChange={(e) => setDescription(e.target.value)}
        label="Descripcion"
        required
      />
      <Button className={styles.btnAdd} size="small" variant="contained" type="submit" >
        Agregar
      </Button>
    </form>
  </div>
</div>
  );
};

export default AddHotel;
