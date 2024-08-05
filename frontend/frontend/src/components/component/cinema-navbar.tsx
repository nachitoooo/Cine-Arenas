import { FaInstagram, FaFacebook, FaWhatsapp} from 'react-icons/fa'; // Importa los iconos de react-icons
import { Button } from "@/components/ui/button"
import { IoTicket } from "react-icons/io5";
import Image from 'next/image';

export default function CinemaNavbar() {
  return (
    <header className="flex items-center justify-between p-4 border-b relative bg-white opacity-90">
      <div className="flex items-center">
      <img
                src="img/logo.jpg"
                className="h-8"
                alt="Flowbite Logo"
              />
      </div>
      <nav className="flex items-center gap-4">
        <Button variant="outline" className="text-pink-600 border-pink-600 ">
          Comprar entradas
          <IoTicket size={20} className='ml-[9px]'></IoTicket>
        </Button>
        <Button variant="outline" className="text-black">
          Contactanos
        </Button>
        <FaInstagram color='pink' className="w-6 h-6 " /> 
        <FaFacebook color='darkblue' className="w-6 h-6 " /> 
        <FaWhatsapp  color='green' className="w-6 h-6 " /> 
      </nav>
    </header>
  );
}
