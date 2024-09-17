// index.tsx
import { GetServerSideProps } from 'next';
import axios from 'axios';
import CinemaLanding from '@/components/component/cinema-landing';
import 'tailwindcss/tailwind.css';

// Define la interfaz Showtime
interface Showtime {
  id: number;
  showtime: string;
}

// Define la interfaz Movie
interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  image: string | null;
  hall_name: string;
  format: string;
  showtimes: Showtime[];
}

interface HomeProps {
  movies: Movie[];
}

const Home = ({ movies }: HomeProps) => {
  return <CinemaLanding movies={movies} />;
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/movies/`);
    // Mapear los datos recibidos para formatear cada película
    const movies: Movie[] = response.data.map((movie: any) => ({
      ...movie,
      image: movie.image?.startsWith('http') ? movie.image : `${process.env.NEXT_PUBLIC_API_URL}${movie.image}`, // Ajustar la URL de la imagen
      showtimes: movie.showtimes.map((showtime: any) => ({
        id: showtime.id,
        showtime: showtime.showtime,
      })),
    }));

    return {
      props: {
        movies,
      },
    };
  } catch (error) {
    // Retornar un objeto props con un array vacío de películas
    return {
      props: {
        movies: [],
      },
    };
  }
};

export default Home;
