import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  image: string | null;
}

const MovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch movies
    axios.get('http://localhost:8000/api/movies/')
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  }, []);

  const handleDelete = async (movieId: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/movies/${movieId}/`);
      setMovies(movies.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Lista de Películas</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {movies.map(movie => (
          <div key={movie.id} className="border border-gray-200 rounded-lg p-4 bg-gray-800 text-white">
            {movie.image && (
  <Image
    src={movie.image}
    width={400} // Proporciona un valor de ancho
    height={600} // Proporciona un valor de alto
    alt={movie.title}
    className="w-full h-64 object-cover rounded-lg mb-4"
  />
)}

            <h2 className="text-2xl font-bold">{movie.title}</h2>
            <p>{movie.description}</p>
            <p><strong>Fecha de Estreno:</strong> {movie.release_date}</p>
            <div className="mt-4 flex space-x-2">
              <Link href={`/edit-movie/${movie.id}`} passHref>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">Editar</button>
              </Link>
              <button onClick={() => handleDelete(movie.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
