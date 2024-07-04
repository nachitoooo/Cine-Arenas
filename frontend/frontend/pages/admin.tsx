import AdminNavigation from "@/components/component/AdminNavigation";
import ProtectedRoute from "@/components/component/protected-route";
import 'tailwindcss/tailwind.css';

const Admin = () => {
  return (
    <ProtectedRoute>
      <AdminNavigation />
      </ProtectedRoute>
      
  );
};

export default Admin;