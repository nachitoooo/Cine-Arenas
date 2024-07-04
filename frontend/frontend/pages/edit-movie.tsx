import MovieList from "@/components/component/movie-list";
import 'tailwindcss/tailwind.css';
import ProtectedRoute from "@/components/component/protected-route";
import { useState } from 'react';

const EditMovie = () => {
 const [isEditing, setIsEditing] = useState(false);

  return (
    <ProtectedRoute>
      <div className={`min-h-screen bg-gray-900 text-white ${isEditing ? 'blur-md' : ''}`}>
        <div className="container mx-auto py-12">
          <MovieList setIsEditing={setIsEditing} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EditMovie;
