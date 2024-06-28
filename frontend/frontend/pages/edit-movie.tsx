import MovieList from "@/components/component/movie-list";
import 'tailwindcss/tailwind.css';
import ProtectedRoute from "@/components/component/protected-route";
const EditMovie = () => {
  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-12">
        <MovieList />
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default EditMovie;
