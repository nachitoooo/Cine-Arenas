import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

interface Seat {
  id: number;
  row: string;
  number: number;
  is_reserved: boolean;
}

interface SeatSelectionProps {
  movieId: string;
}

const SeatSelection = ({ movieId }: SeatSelectionProps) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/seats/?movie_id=${movieId}`);
        setSeats(response.data);
      } catch (error) {
        console.error('Error fetching seats:', error);
      }
    };

    fetchSeats();
  }, [movieId]);

  const handleSeatClick = (seatId: number) => {
    setSelectedSeats(prevSelected =>
      prevSelected.includes(seatId)
        ? prevSelected.filter(id => id !== seatId)
        : [...prevSelected, seatId]
    );
  };

  const handleReserveSeats = async () => {
    try {
      if (selectedSeats.length === 0) {
        alert("No seats selected");
        return;
      }

      if (!email) {
        alert("Email is required");
        return;
      }
  
      const response = await axios.post('http://localhost:8000/api/reservations/', {
        movie: movieId,
        seats: selectedSeats,
      });
  
      alert('Seats reserved successfully');
  
      // Crear preferencia de pago en MercadoPago
      const paymentResponse = await axios.post('http://localhost:8000/api/create-payment/', {
        seats: selectedSeats,
        email: email,
      });
  
      setSelectedSeats([]);
      window.location.href = paymentResponse.data.init_point;
  
      // Actualizar asientos después de la reserva
      const updatedSeats = await axios.get(`http://localhost:8000/api/seats/?movie_id=${movieId}`);
      setSeats(updatedSeats.data);
  
    } catch (error) {
      console.error('Error reserving seats:', error);
      alert('Error reserving seats. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Seleccionar asientos</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="mb-4 p-2 border"
        required
      />
      <div className="grid grid-cols-10 gap-2 mb-4">
        {seats.map(seat => (
          <Button
            key={seat.id}
            onClick={() => handleSeatClick(seat.id)}
            className={`p-2 text-sm ${
              seat.is_reserved
                ? 'bg-red-500 cursor-not-allowed'
                : selectedSeats.includes(seat.id)
                ? 'bg-blue-800 transition-colors duration-300' // Añadida transición
                : 'bg-green-500'
            }`}
            disabled={seat.is_reserved}
            style={{ backgroundColor: selectedSeats.includes(seat.id) ? '#00a331' : undefined }}
          >
            {seat.row}{seat.number}
          </Button>
        ))}
      </div>
      <Button
        onClick={handleReserveSeats}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={selectedSeats.length === 0}
      >
        Reserve Selected Seats
      </Button>
    </div>
  );
};

export default SeatSelection;
