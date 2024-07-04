import { PiArmchairLight } from "react-icons/pi";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

// Definición de la interfaz para los asientos
interface Seat {
  id: number;
  row: string;
  number: number;
  is_reserved: boolean;
}

// Props esperadas por el componente SeatSelection
interface SeatSelectionProps {
  movieId: string;
}

const SeatSelection = ({ movieId }: SeatSelectionProps) => {
  // Estados locales
  const [seats, setSeats] = useState<Seat[]>([]); // Lista de asientos disponibles
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]); // Lista de asientos seleccionados
  const [email, setEmail] = useState(''); // Estado para almacenar el email del usuario

  // Efecto para cargar los asientos disponibles al inicio y cuando cambia movieId
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        // Petición GET para obtener los asientos disponibles para la película específica
        const response = await axios.get(`http://localhost:8000/api/seats/?movie_id=${movieId}`);
        setSeats(response.data); // Actualiza el estado de los asientos con la respuesta del servidor
      } catch (error) {
        console.error('Error fetching seats:', error);
      }
    };

    fetchSeats(); // Llama a la función para cargar los asientos al montar o cuando cambia movieId
  }, [movieId]); // Dependencia: movieId, se ejecutará el efecto cuando cambie

  // Función para manejar el clic en un asiento
  const handleSeatClick = (seatId: number) => {
    setSelectedSeats(prevSelected =>
      prevSelected.includes(seatId)
        ? prevSelected.filter(id => id !== seatId) // Si el asiento ya está seleccionado, quitarlo de la lista
        : [...prevSelected, seatId] // Si no está seleccionado, añadirlo a la lista
    );
  };

  // Función para reservar los asientos seleccionados
  const handleReserveSeats = async () => {
    try {
      // Validaciones simples antes de hacer la reserva
      if (selectedSeats.length === 0) {
        alert("No seats selected"); // Alerta si no se han seleccionado asientos
        return;
      }
  
      if (!email) {
        alert("Email is required");
        return;
      }
  
      // Petición POST para reservar los asientos seleccionados
      const response = await axios.post('http://localhost:8000/api/reservations/', {
        movie: movieId,
        seats: selectedSeats,
      });

      alert('Asientos reservados correctamente'); // Alerta de éxito
  
      // Después de reservar, petición a la API de MercadoPago para realizar el pago.  
      const paymentResponse = await axios.post('http://localhost:8000/api/create-payment/', {
        seats: selectedSeats,
        email: email,
      });
  
      setSelectedSeats([]); // reiniciar la lista de asientos seleccionados
      window.location.href = paymentResponse.data.init_point; // Redirige al punto de inicio de pago de MercadoPago
  
      // Actualiza la lista de asientos después de la reserva
      const updatedSeats = await axios.get(`http://localhost:8000/api/seats/?movie_id=${movieId}`);
      setSeats(updatedSeats.data);
  
    } catch (error) {
      console.error('Error reserving seats:', error);
      alert('Error reserving seats. Please try again.'); // Alerta si ocurre un error durante la reserva
    }
  };

  // renderizar el componente SeatSelection
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Seleccionar asientos</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="mb-4 p-2 border"
        required
      />
      <div className="grid grid-cols-10 gap-2 mb-4">
        {/* asientos disponibles */}
        {seats.map(seat => (
          <Button
            key={seat.id}
            onClick={() => handleSeatClick(seat.id)}
            className={`p-2 text-sm flex items-center justify-center ${
              seat.is_reserved
                ? 'bg-red-500 cursor-not-allowed'
                : selectedSeats.includes(seat.id)
                ? 'bg-blue-800 transition-colors duration-300' 
                : 'bg-green-500'
            }`}
            disabled={seat.is_reserved}
            style={{ backgroundColor: selectedSeats.includes(seat.id) ? '#d1d1d1' : undefined , borderRadius:'5px' }}
          >
            <PiArmchairLight className="mr-2" />
            {seat.row}{seat.number}
          </Button>
        ))}
      </div>
      <Button
        onClick={handleReserveSeats}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={selectedSeats.length === 0}
      >
        Reservar asientos seleccionados
      </Button>
    </div>
  );
};

export default SeatSelection;
