import { useRouter } from 'next/router';
import MovieForm from '@/components/component/movie-form';
import 'tailwindcss/tailwind.css';

const EditMovie = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-12">
        <MovieForm movieId={id as string} />
      </div>
    </div>
  );
};

export default EditMovie;
