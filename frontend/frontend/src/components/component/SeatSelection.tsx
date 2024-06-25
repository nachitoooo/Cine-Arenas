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

  useEffect(() => {
    axios.get(`http://localhost:8000/api/seats/`)
      .then(response => {
        setSeats(response.data);
      })
      .catch(error => {
        console.error('Error fetching seats:', error);
      });
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
      await axios.post('http://localhost:8000/api/reservations/', {
        movie: movieId,
        seats: selectedSeats,
      });
      alert('Seats reserved successfully');
      setSelectedSeats([]);
      const response = await axios.get(`http://localhost:8000/api/seats/`);
      setSeats(response.data);

      // Crear preferencia de pago en MercadoPago
      const paymentResponse = await axios.post('http://localhost:8000/api/create-payment/');
      window.location.href = paymentResponse.data.init_point;  // Redirigir a la página de pago
    } catch (error) {
      console.error('Error reserving seats:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Select Seats</h1>
      <div className="grid grid-cols-8 gap-2">
        {seats.map(seat => (
          <button
            key={seat.id}
            onClick={() => handleSeatClick(seat.id)}
            className={`p-2 border rounded ${seat.is_reserved ? 'bg-red-500' : selectedSeats.includes(seat.id) ? 'bg-green-500' : 'bg-gray-300'}`}
            disabled={seat.is_reserved}
          >
            {seat.row}{seat.number}
          </button>
        ))}
      </div>
      <div className="text-center mt-8">
        <Button onClick={handleReserveSeats} className="bg-blue-500 text-white rounded-lg px-4 py-2">
          Reserve Selected Seats
        </Button>
      </div>
    </div>
  );
};

export default SeatSelection;
