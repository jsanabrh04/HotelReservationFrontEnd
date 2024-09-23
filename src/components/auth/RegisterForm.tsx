import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/formStyle.css'
import { Button, Link, TextField } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const [userId, setUserId] = useState<number | ''>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axios.post('http://localhost:5432/users/createUser', {
        userId,
        email,
        password,
        name,
        phoneNumber,
      });

      // Maneja el éxito de registro
      window.location.href = '/login'; // Redirige al inicio de sesión, por ejemplo

    } catch (error) {
      // Maneja error de registro
      setError('Registration failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="form-container">
    <form onSubmit={handleSubmit} className='form'>
      <h1>Registro</h1>
      <TextField
      type="number"
      value={userId === '' ? '' : userId} 
      margin="normal"
      fullWidth
      size="small"
      onChange={(e) => setUserId(Number(e.target.value))}
      label="Identificacion"
      required
      />
      <TextField
      type="email"
      value={email}
      margin="normal"
      fullWidth
      size="small"
      onChange={(e) => setEmail(e.target.value)}
      label="Email"
      required
      />
      <TextField
      type="password"
      value={password}
      margin="normal"
      fullWidth
      size="small"
      onChange={(e) => setPassword(e.target.value)}
      label="Contraseña"
      required
      />
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
      value={phoneNumber}
      margin="normal"
      fullWidth
      size="small"
      onChange={(e) => setPhoneNumber(e.target.value)}
      label="Numero de telefono"
      required
      />
     <Button variant="contained" type="submit" >Registrarse</Button>
      <p>¿Ya tiene una cuenta? Inicie sesion <Link component={RouterLink} to="/login" className='linkRegister'>aqui</Link></p>
      {error && <p>{error}</p>}
    </form>
    </div>
  );
};

export default RegisterForm;
