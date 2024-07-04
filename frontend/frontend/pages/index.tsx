import { GetServerSideProps } from 'next';
import axios from 'axios';
import CinemaLanding from '@/components/component/cinema-landing';
import 'tailwindcss/tailwind.css';

// ------------- estructurar datos de las peliculas ----------
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

// ------------- obtener datos de la API de DRF ----------


export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/movies/');
    // ------------- renderizar las peliculas de la API de DRF ----------

    // mapear los datos recibidos (response.data) para formatear cada película . Si la imagen de la película no comienza con 'http', se asume que es una ruta local y se le añade http://localhost:8000 para completar la URL.

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
    // retornar un objeto props con un array vacío de peliculas, asegurando que la página no falle completamente si no se pueden obtener las películas. (VERIFICAR TENER LA API DEPLOYEADA EN EL LOCAL HOST, EN UN FUTURO DEPLYOEADA EN RAILWAY.)

    return {
      props: {
        movies: [],
      },
    };
  }
};

export default Home;
