import { FaInstagram, FaFacebook, FaWhatsapp} from 'react-icons/fa'; // Importa los iconos de react-icons
import { Button } from "@/components/ui/button"
import { IoTicket } from "react-icons/io5";
import Image from 'next/image';

export default function CinemaNavbar() {
  return (
    <header className="flex items-center justify-between p-4  relative bg-black opacity-60 ">
      <div className="flex items-center">
      <img
                src="img/logo.jpg"
                className="h-8"
                alt="Flowbite Logo"
              />
      </div>
      <nav className="flex items-center gap-4">
        <Button variant="outline" className="text-white border-gray-200 ">
          Comprar entradas
          <IoTicket size={20} className='ml-[9px]'></IoTicket>
        </Button>
        <Button variant="outline" className="text-white">
          Contactanos
        </Button>
        
      </nav>
    </header>
  );
}
