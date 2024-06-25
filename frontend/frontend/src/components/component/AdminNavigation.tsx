import Link from "next/link";
import 'tailwindcss/tailwind.css';

const AdminNavigation = () => {
  return (
    <nav className="bg-gray-800 shadow-lg p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="text-white text-2xl font-bold">Acme Cinema Admin</Link>
        <div className="flex space-x-4">
          <Link href="/create-movie" className="text-white hover:text-gray-400">Crear Película</Link>
          <Link href="/" className="text-white hover:text-gray-400">Volver al sitio</Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;
