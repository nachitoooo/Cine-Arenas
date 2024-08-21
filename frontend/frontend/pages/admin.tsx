import AdminNavigation from "@/components/component/AdminNavigation";
import AdminSideBar from "@/components/component/AdminSideBar";
import ProtectedRoute from "@/components/component/protected-route";
import 'tailwindcss/tailwind.css';

const Admin = () => {
  return (
    <ProtectedRoute>
      <AdminSideBar />
      </ProtectedRoute>
      
  );
};

export default Admin;