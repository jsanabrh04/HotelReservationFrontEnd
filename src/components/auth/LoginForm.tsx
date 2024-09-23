// login.tsx
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Button, Link, TextField } from '@mui/material';
import '../../styles/formStyle.css'

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5432/auth/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { access_token } = response.data;

      if (access_token) {
        localStorage.setItem('access_token', access_token);
        window.location.href = '/home'; // Redirige al dashboard
      } else {
        setError('No se recibió el token.');
      }

    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error(error);
    }
  };

  return (
    <div className="form-container">
    <form onSubmit={handleSubmit} className='form'>
      <h1>Inicio de Sesion</h1>
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
      <Button variant="contained" type="submit" >Ingresar</Button>
      <p>¿No tiene una cuenta? Cree una <Link component={RouterLink} to="/register" className='linkRegister'>aqui</Link></p>
      {error && <p>{error}</p>}
    </form>
    </div>
  );
};

export default LoginForm;
