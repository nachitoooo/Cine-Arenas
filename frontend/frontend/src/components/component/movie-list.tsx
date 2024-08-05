import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import MovieForm from './movie-form';
import AdminNavigation from './AdminNavigation';
import '../../app/globals.css'; // Importación correcta del archivo CSS

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
      const response = await axios.get('http://localhost:8000/api/movies/', {
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
    // Muestra el cuadro de diálogo de confirmación
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
        await axios.delete(`http://localhost:8000/api/movies/${movieId}/`, {
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

      const response = await axios.put(`http://localhost:8000/api/movies/${updatedMovie.id}/`, formData, {
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

  return (
    <div className="container mx-auto px-4">
      <AdminNavigation />
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Lista de Películas</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {movies.map(movie => (
          <div key={movie.id} className="border border-gray-200 rounded-lg p-4 bg-gray-800 text-white">
            {movie.image && (
              <Image
                src={movie.image}
                width={400}
                height={600}
                alt={movie.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-2xl font-bold">{movie.title}</h2>
            <p>{movie.description}</p>
            <p><strong>Fecha de Estreno:</strong> {movie.release_date}</p>
            <div className="mt-4 flex space-x-2">
              <button onClick={() => handleEdit(movie)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Editar</button>
              <button onClick={() => handleDelete(movie.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      {editingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg">
            <MovieForm
              movieId={editingMovie.id.toString()}
              initialData={editingMovie}
              onCancel={handleCancelEdit}
              onSave={handleSaveEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieList;
