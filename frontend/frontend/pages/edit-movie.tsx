import MovieList from "@/components/component/movie-list";
import 'tailwindcss/tailwind.css';

const EditMovie = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-12">
        <MovieList />
      </div>
    </div>
  );
};

export default EditMovie;
