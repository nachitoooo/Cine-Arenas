import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Swal from 'sweetalert2';

interface MovieFormProps {
  movieId?: string;
  initialData?: Movie;
  onCancel?: () => void;
  onSave?: (movie: Movie) => void;
  updateMoviesList?: (movie: Movie) => void;  // Nueva prop para actualizar la lista
}

interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  image: string | null;
  cinema_listing: string | null;
  hall_name: string;
  format: string;
  showtimes: string[];
  duration: string;
  movie_language: string;
}

const MovieForm = ({ movieId, initialData, onCancel, onSave, updateMoviesList }: MovieFormProps) => {
  const [title, setTitle] = useState<string>(initialData?.title || '');
  const [releaseDate, setReleaseDate] = useState<string>(initialData?.release_date || '');
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [image, setImage] = useState<File | null>(null);
  const [cinemaListing, setCinemaListing] = useState<File | null>(null);
  const [hallName, setHallName] = useState<string>(initialData?.hall_name || '');
  const [format, setFormat] = useState<string>(initialData?.format || '2D');
  const [showtimes, setShowtimes] = useState<string[]>(initialData?.showtimes || ['']);
  const [duration, setDuration] = useState<string>(initialData?.duration || '');
  const [movieLanguage, setMovieLanguage] = useState<string>(initialData?.movie_language || '');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (movieId && !initialData) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/movies/${movieId}/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      }).then((response) => {
        const {
          title, release_date, description, image, cinema_listing,
          hall_name, format, showtimes, duration, movie_language
        } = response.data;
        setTitle(title);
        setReleaseDate(release_date);
        setDescription(description);
        setImage(null);
        setCinemaListing(null);
        setHallName(hall_name);
        setFormat(format);
        setShowtimes(showtimes || ['']);
        setDuration(duration);
        setMovieLanguage(movie_language);
      }).catch((error) => {
        console.error('Error fetching movie:', error);
      });
    }
  }, [movieId, initialData]);

  const handleAddShowtime = () => {
    setShowtimes([...showtimes, '']);
  };

  const handleShowtimeChange = (index: number, value: string) => {
    const newShowtimes = [...showtimes];
    newShowtimes[index] = value;
    setShowtimes(newShowtimes);
  };

  const handleRemoveShowtime = (index: number) => {
    const newShowtimes = showtimes.filter((_, i) => i !== index);
    setShowtimes(newShowtimes);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (showtimes.some(showtime => !showtime)) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Todos los campos deben estar completos antes de guardar.'
        });
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('release_date', releaseDate);
    formData.append('description', description);

    if (image) {
        formData.append('image', image);
    }

    if (cinemaListing) {
        formData.append('cinema_listing', cinemaListing);
    }

    formData.append('hall_name', hallName);
    formData.append('format', format);
    formData.append('duration', duration);
    formData.append('movie_language', movieLanguage);

    showtimes.forEach((time, index) => {
        const date = new Date(time);
        formData.append(`showtime_${index + 1}`, date.toISOString());
    });

    const token = localStorage.getItem('authToken');

    try {
        let response;
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Token ${token}`
            },
        };

        if (movieId) {
            response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/movies/${movieId}/`, formData, config);
        } else {
            response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/movies/`, formData, config);
        }

        if (onSave) {
            onSave(response.data);
        }

        if (updateMoviesList) {
            updateMoviesList(response.data);  // Actualizar la lista de películas
        }

        if (onCancel) {
          onCancel(); 
        }

        router.push('/edit-movie');
    } catch (error) {
        console.error('Error saving movie:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al guardar la película. Por favor, verifica los datos e intenta nuevamente.'
        });
    }
};

return (
  <div className="container mx-auto px-4 py-8 bg-gray-50 text-gray-800 min-h-screen">
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300">
      <div className="p-6 bg-gray-100">
        <h3 className="text-2xl font-bold text-gray-800">{movieId ? 'Editar Película' : 'Crear Película'}</h3>
        <p className="mt-2 text-gray-700">Completa el formulario para {movieId ? 'editar' : 'agregar'} una película a la cartelera.</p>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-800">Título</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded" 
                placeholder="Ingresa el título de la película" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="releaseDate" className="text-sm font-medium text-gray-800">Fecha de Estreno</Label>
              <Input 
                id="releaseDate" 
                type="date" 
                value={releaseDate} 
                onChange={(e) => setReleaseDate(e.target.value)} 
                className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-800">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[120px] bg-gray-100 text-gray-800 border border-gray-300 rounded"
              placeholder="Proporciona una breve descripción de la película"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium text-gray-800">Imagen</Label>
              <Input 
                id="image" 
                type="file" 
                onChange={(e) => {
                  if (e.target.files) {
                    setImage(e.target.files[0]);
                  }
                }} 
                className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cinemaListing" className="text-sm font-medium text-gray-800">Cartelera de Cine</Label>
              <Input 
                id="cinemaListing" 
                type="file" 
                onChange={(e) => {
                  if (e.target.files) {
                    setCinemaListing(e.target.files[0]);
                  }
                }} 
                className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hallName" className="text-sm font-medium text-gray-800">Nombre de la Sala</Label>
              <Input 
                id="hallName" 
                value={hallName} 
                onChange={(e) => setHallName(e.target.value)} 
                className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded" 
                placeholder="Ingresa el nombre de la sala"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="format" className="text-sm font-medium text-gray-800">Formato</Label>
              <select 
                id="format" 
                value={format} 
                onChange={(e) => setFormat(e.target.value)} 
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-gray-100 text-gray-800 text-sm"
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium text-gray-800">Duración</Label>
              <Input 
                id="duration" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)} 
                className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded" 
                placeholder="Ingresa la duración (e.g., 1:30 HS)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="movieLanguage" className="text-sm font-medium text-gray-800">Idioma</Label>
              <Input 
                id="movieLanguage" 
                value={movieLanguage} 
                onChange={(e) => setMovieLanguage(e.target.value)} 
                className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded" 
                placeholder="Ingresa el idioma de la película"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="showtimes" className="text-sm font-medium text-gray-800">Horarios</Label>
            {showtimes.map((showtime, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <Input 
                  type="datetime-local" 
                  value={showtime} 
                  onChange={(e) => handleShowtimeChange(index, e.target.value)} 
                  className="flex-grow bg-gray-100 text-gray-800 border border-gray-300 rounded" 
                />
                <Button type="button" onClick={() => handleRemoveShowtime(index)} variant="destructive" size="sm" className='text-white bg-red-600 border-solid border-2'>
                  Eliminar
                </Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddShowtime} variant="outline" size="sm" className="mt-2 text-white bg-gray-800">
              Añadir Horario
            </Button>
          </div>
          <div className="flex justify-end space-x-4 mt-6 text-gray-800">
            {onCancel && (
              <Button type="button" onClick={onCancel} variant="outline" className="text-gray-800 border-gray-800">
                Cancelar
              </Button>
            )}
            <Button type="submit" className="bg-gray-800 text-white hover:bg-gray-900">
              {movieId ? 'Guardar Cambios' : 'Guardar Película'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
};

export default MovieForm;
