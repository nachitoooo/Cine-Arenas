import { GetServerSideProps } from 'next';
import axios from 'axios';
import CinemaLanding from '@/components/component/cinema-landing';
import 'tailwindcss/tailwind.css';

interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  image: string | null;
}

interface HomeProps {
  movies: Movie[];
}

const Home = ({ movies }: HomeProps) => {
  return <CinemaLanding movies={movies} />;
};
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/movies/');
    const movies: Movie[] = response.data.map((movie: Movie) => ({
      ...movie,
      image: movie.image?.startsWith('http') ? movie.image : `http://localhost:8000${movie.image}`,
    }));

    return {
      props: {
        movies,
      },
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    return {
      props: {
        movies: [],
      },
    };
  }
};

export default Home;
