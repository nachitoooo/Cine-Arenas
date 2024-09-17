import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Swal from 'sweetalert2';
import MovieForm from './movie-form';
import AdminNavigation from './AdminNavigation';
import '../../app/globals.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

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

interface MovieListProps {
  setIsEditing: (isEditing: boolean) => void;
}

const MovieList = ({ setIsEditing }: MovieListProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/movies/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleDelete = async (movieId: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem('authToken');
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/movies/${movieId}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setMovies(movies.filter(movie => movie.id !== movieId));
        Swal.fire(
          '¡Eliminado!',
          'La película ha sido eliminada.',
          'success'
        );
      } catch (error) {
        console.error('Error deleting movie:', error);
        Swal.fire(
          'Error',
          'Hubo un problema al eliminar la película.',
          'error'
        );
      }
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditingMovie(null);
    setIsEditing(false);
  };

  const handleSaveEdit = async (updatedMovie: Movie) => {
    const token = localStorage.getItem('authToken');
    try {
      const formData = new FormData();
      formData.append('title', updatedMovie.title);
      formData.append('release_date', updatedMovie.release_date);
      formData.append('description', updatedMovie.description);
      if (updatedMovie.image instanceof File) {
        formData.append('image', updatedMovie.image);
      }
      formData.append('duration', updatedMovie.duration);  
      formData.append('movie_language', updatedMovie.movie_language);

      if (updatedMovie.showtimes && updatedMovie.showtimes.length > 0) {
        updatedMovie.showtimes.forEach((showtime, index) => {
          formData.append(`showtime_${index + 1}`, showtime);
        });
      }

      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/movies/${updatedMovie.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        },
      });

      setMovies(movies.map(movie => (movie.id === updatedMovie.id ? response.data : movie)));
      setEditingMovie(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };

  const handleAddMovie = (newMovie: Movie) => {
    setMovies([...movies, newMovie]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminNavigation />
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-100 mt-8">Lista de Películas</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {movies.map(movie => (
          <div key={movie.id} className="border border-gray-700 rounded-lg p-6 bg-gray-900 text-gray-100">
            {movie.image && (
              <Image
                src={movie.image}
                width={600}
                height={600}
                alt={movie.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-2xl font-semibold mb-2">{movie.title}</h2>
            <p className="mb-2">{movie.description}</p>
            <p className="mb-4"><strong>Fecha de Estreno:</strong> {movie.release_date}</p>
            <div className="flex space-x-2">
  <button onClick={() => handleEdit(movie)} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
    <FaEdit className="mr-2" />
    Editar película
  </button>
  <button onClick={() => handleDelete(movie.id)} className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
    <FaTrash className="mr-2" />
    Eliminar película
  </button>
</div>
          </div>
        ))}
      </div>
      {editingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white p-6 rounded-lg w-full max-w-4xl mx-4 my-8 max-h-[95vh] overflow-y-auto">
          <MovieForm
            movieId={editingMovie.id.toString()}
            initialData={editingMovie}
            onCancel={handleCancelEdit}
            onSave={handleSaveEdit}
            updateMoviesList={handleSaveEdit}
          />
        </div>
      </div>
      
      )}
    </div>
  );
};

export default MovieList;
