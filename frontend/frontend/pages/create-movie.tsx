import CreateMovie from "@/components/component/movie-form";
import 'tailwindcss/tailwind.css';
import MovieForm from "@/components/component/movie-form";
import ProtectedRoute from "@/components/component/protected-route";

export default function Home() {
  return (
    <ProtectedRoute>
    <CreateMovie></CreateMovie>
    </ProtectedRoute>
     
  );
}
