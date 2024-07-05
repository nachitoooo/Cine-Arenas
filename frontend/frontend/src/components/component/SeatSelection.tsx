import { PiArmchairLight } from "react-icons/pi";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

// Definición de la interfaz para los asientos
interface Seat {
  id: number;
  row: string;
  number: number;
  is_reserved: boolean;
}

// Definición de la interfaz para la película
interface Movie {
  image: string | null;
  description: string;
}

// Props esperadas por el componente SeatSelection
interface SeatSelectionProps {
  movieId: string;
}

const SeatSelection = ({ movieId }: SeatSelectionProps) => {
  // Estados locales
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [movie, setMovie] = useState<Movie | null>(null);

  // Efecto para cargar los asientos disponibles al inicio y cuando cambia movieId
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/seats/?movie_id=${movieId}`
        );
        setSeats(response.data);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };

    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/movies/${movieId}/`
        );
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    fetchSeats();
    fetchMovie();
  }, [movieId]);

  const handleSeatClick = (seatId: number) => {
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seatId)
        ? prevSelected.filter((id) => id !== seatId)
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

      const response = await axios.post(
        "http://localhost:8000/api/reservations/",
        {
          movie: movieId,
          seats: selectedSeats,
        }
      );

      alert("Asientos reservados correctamente");

      const paymentResponse = await axios.post(
        "http://localhost:8000/api/create-payment/",
        {
          seats: selectedSeats,
          email: email,
        }
      );

      setSelectedSeats([]);
      window.location.href = paymentResponse.data.init_point;

      const updatedSeats = await axios.get(
        `http://localhost:8000/api/seats/?movie_id=${movieId}`
      );
      setSeats(updatedSeats.data);
    } catch (error) {
      console.error("Error reserving seats:", error);
      alert("Error reserving seats. Please try again.");
    }
  };

  return (
    
    <div className="p-4 flex gap-4 items-start h-[100vh]">
      <div className="w-1/4">
        {movie && (
          <>
            <img
              src={movie.image || "https://via.placeholder.com/150"}
              alt="Imagen de la película"
              className="w-96 h-100 rounded-lg shadow-lg"
            />
            <p className="mt-2 text-md text-white-700">{movie.description}</p>
          </>
        )}
      </div>

      {/* Formulario de selección de asientos */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">
          Seleccionar asientos - Valor de la entrada 100$
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingrese su Email"
          className="mb-4 p-2 border rounded-lg w-100"
          required
        />
        <div className="grid grid-cols-10 gap-2 mb-4">
          {seats.map((seat) => (
            <Button
              key={seat.id}
              onClick={() => handleSeatClick(seat.id)}
              className={`text-sm flex items-center justify-center ${
                seat.is_reserved
                  ? "bg-red-500 cursor-not-allowed"
                  : selectedSeats.includes(seat.id)
                  ? "bg-blue-800 transition-colors duration-300"
                  : "bg-green-500"
              }`}
              disabled={seat.is_reserved}
              style={{
                backgroundColor: selectedSeats.includes(seat.id)
                  ? "#d1d1d1"
                  : undefined,
                borderRadius: "5px",
              }}
            >
              <PiArmchairLight className="mr-2" />
              {seat.row}
              {seat.number}
            </Button>
          ))}
        </div>
        <div className="flex justify-end">
          <div className="text-2xl mr-12">Sub total: $15.000</div>
          <Button
            onClick={handleReserveSeats}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={selectedSeats.length === 0}
          >
            Reservar asientos seleccionados
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
