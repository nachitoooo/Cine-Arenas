import CreateMovie from "@/components/component/movie-form";
import 'tailwindcss/tailwind.css';
import ProtectedRoute from "@/components/component/protected-route";
import AdminNavigation from "@/components/component/AdminNavigation";
export default function Home() {
  return (
    <ProtectedRoute>
    <AdminNavigation />
    <CreateMovie></CreateMovie>
    </ProtectedRoute>
     
  );
}
