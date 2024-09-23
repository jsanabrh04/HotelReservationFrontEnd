import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Importar uuid
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import styles from "../../styles/reservationsStyle.module.css";

interface Hotel {
  hotelId: number;
  name: string;
}

enum Room {
  BASIC = "basic",
  COMUN = "comun",
  PREMIUM = "premium",
  PH = "penthouse",
}

interface CreateReservationDto {
  userId: number;
  hotelId: number;
  checkInDate: string;
  checkOutDate: string;
  room: Room;
}

const getRoleFromToken = (): string | null => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return null;
  }

  const payloadBase64 = token.split(".")[1];
  if (!payloadBase64) {
    return null;
  }

  const payload = JSON.parse(atob(payloadBase64));

  return payload.role || null;
};

const Reservation: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [userId, setUserId] = useState<number>(0);
  const [hotelId, setHotelId] = useState<number | "">("");
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [room, setRoom] = useState<Room>(Room.BASIC);
  const role = getRoleFromToken();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5432/hotels/findAllHotels",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setHotels(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hotels", error);
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleHotelChange = (e: SelectChangeEvent<number>) => {
    setHotelId(Number(e.target.value) || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let errorMessage = "";

    if (!checkOutDate) {
      errorMessage += "Fecha de Check-Out es requerida.\n";
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      errorMessage +=
        "La fecha de Check-Out debe ser después de la fecha de Check-In.\n";
    }

    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("No token found");
      return;
    }

    const reservationData: CreateReservationDto = {
      userId,
      hotelId: hotelId !== "" ? hotelId : 0,
      checkInDate: new Date(checkInDate).toISOString(),
      checkOutDate: new Date(checkOutDate).toISOString(),
      room,
    };

    try {
      const response = await axios.post(
        "http://localhost:5432/reservation/createReservation",
        reservationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      alert("Reserva creada exitosamente");
      navigate("/home");
    } catch (error) {
      console.error("Error creating reservation", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Backend error response:", error.response.data);
        alert(
          `Error al crear la reserva: ${
            error.response.data.message ||
            "Verifica los datos y vuelve a intentarlo."
          }`
        );
      } else {
        alert(
          "Error al crear la reserva. Verifica los datos y vuelve a intentarlo."
        );
      }
    }
  };

  return (
    <div>
      {loading ? (
        <p>Cargando hoteles...</p>
      ) : (
        <div className={styles.page}>
          <Navbar role={role || ""} className={styles.navbar} />
          <h1>Crear Reserva</h1>
          <form onSubmit={handleSubmit}>
            <TextField
              type="number"
              value={userId || ""}
              margin="normal"
              fullWidth
              onChange={(e) => setUserId(Number(e.target.value))}
              label="Identificacion"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="hotel-select-label">Hotel</InputLabel>
              <Select
                labelId="hotel-select-label"
                value={hotelId !== "" ? hotelId : ""}
                onChange={handleHotelChange}
                label="Hotel"
                required
              >
                <MenuItem value="" disabled>
                  Selecciona un hotel
                </MenuItem>
                {hotels.map((hotel) => (
                  <MenuItem key={uuidv4()} value={hotel.hotelId}>
                    {hotel.name} (ID: {hotel.hotelId})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Check-In Date"
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />

            <TextField
              label="Check-Out Date"
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="room-select-label">Room</InputLabel>
              <Select
                labelId="room-select-label"
                value={room}
                onChange={(e) => setRoom(e.target.value as Room)}
                label="Room"
                required
              >
                <MenuItem value={Room.BASIC}>Basic</MenuItem>
                <MenuItem value={Room.COMUN}>Común</MenuItem>
                <MenuItem value={Room.PREMIUM}>Premium</MenuItem>
                <MenuItem value={Room.PH}>Penthouse</MenuItem>
              </Select>
            </FormControl>

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Crear Reserva
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Reservation;
