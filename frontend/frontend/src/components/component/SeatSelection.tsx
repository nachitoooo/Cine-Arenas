import { PiArmchairLight } from "react-icons/pi";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Swal from 'sweetalert2';
interface Seat {
  id: number;
  row: string;
  number: number;
  is_reserved: boolean;
}

interface Movie {
  cinema_listing: string | null; 
  title: string;
  description: string;
  format: string;
  showtimes: { id: number; showtime: string }[];
}

interface SeatSelectionProps {
  movieId: string;
}

const SeatSelection = ({ movieId }: SeatSelectionProps) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [movie, setMovie] = useState<Movie | null>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [selectedShowtime, setSelectedShowtime] = useState<number | null>(null);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/seats/?movie_id=${movieId}`);
        setSeats(response.data);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };

    const fetchMovie = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/movies/${movieId}/`);
        setMovie(response.data);
        setSelectedFormat(response.data.format);
        setSelectedShowtime(response.data.showtimes.length > 0 ? response.data.showtimes[0].id : null);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    fetchSeats();
    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    const seatPrice = 100;
    setSubtotal(selectedSeats.length * seatPrice);
  }, [selectedSeats]);

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
        Swal.fire({
          icon: 'error',
          title: 'Advertencia',
          text: 'Asegurate de proporcionar un e-mail válido.'
        });
        return;
      }

      if (!selectedFormat || !selectedShowtime) {
        alert("Format and showtime are required");
        return;
      }

      const response = await axios.post("http://localhost:8000/api/reservations/", {
        movie: movieId,
        seats: selectedSeats,
      });

      Swal.fire({
        title: 'Confirmado!',
        text: 'Asientos reservados correctamente',
        icon: 'success',
        confirmButtonText: 'Ok'
      });

      const paymentResponse = await axios.post("http://localhost:8000/api/create-payment/", {
        seats: selectedSeats,
        email: email,
        format: selectedFormat,
        showtime_id: selectedShowtime,
      });

      setSelectedSeats([]);
      window.location.href = paymentResponse.data.init_point;

      const updatedSeats = await axios.get(`http://localhost:8000/api/seats/?movie_id=${movieId}`);
      setSeats(updatedSeats.data);
    } catch (error) {
      console.error("Error reserving seats:", error);
      alert("Error reserving seats. Please try again.");
    }
  };

  const formatDateToArgentinaTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'America/Argentina/Buenos_Aires'
    };
    return new Date(dateString).toLocaleString('es-AR', options);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
      <div className="flex flex-col md:flex-row gap-8 flex-grow">
        <div className="w-full md:w-1/3 flex flex-col">
          {movie && (
            <div className="space-y-4 flex flex-col h-full">
              <h3 className="text-3xl text-center font-bold">{movie.title}</h3>
              <div className="relative cursor-pointer flex-grow" onClick={() => setShowDescription(!showDescription)}>
                <img
                  src={movie.cinema_listing || "https://st4.depositphotos.com/14953852/24787/v/380/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"}
                  alt="Imagen de la película"
                  className="w-full h-full object-cover rounded-lg shadow-lg max-h-[80vh]"
                />
                {showDescription && (
                  <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center p-4">
                    <p className="text-white text-sm overflow-y-auto max-h-full">{movie.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3 space-y-6">
          <h2 className="text-2xl font-bold text-center">Seleccionar asientos</h2>
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su email"
            className="w-full p-2 border rounded-lg text-black"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Formato:</label>
              <select 
                value={selectedFormat} 
                onChange={(e) => setSelectedFormat(e.target.value)} 
                className="w-full p-2 border rounded-lg text-black"
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Horarios disponibles:</label>
              <select 
                value={selectedShowtime || ''} 
                onChange={(e) => setSelectedShowtime(Number(e.target.value))}
                className="w-full p-2 border rounded-lg text-black"
              >
                {movie?.showtimes.map((showtime) => (
                  <option key={showtime.id} value={showtime.id}>
                    {formatDateToArgentinaTime(showtime.showtime)}
                  </option>
                ))}
              </select>
            </div>
          </div>

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

          <div className="flex justify-between items-center">
            <div className="text-xl font-bold">Subtotal: ${subtotal}</div>
            <Button
              onClick={handleReserveSeats}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={selectedSeats.length === 0}
            >
              Reservar asientos
              <PiArmchairLight size={22} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SeatSelection;