import React, { useEffect } from "react";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPlay } from "react-icons/fa";
import MovieSlider from "./slider";
import 'tailwindcss/tailwind.css';

interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  image: string | null;
}

interface CinemaLandingProps {
  movies: Movie[];
}

const CinemaLanding: React.FC<CinemaLandingProps> = ({ movies }) => {
  useEffect(() => {
    const menuTarget = document.querySelector('[data-menu-toggle]') as HTMLElement;
    const menu = document.querySelector('[data-menu]') as HTMLElement;

    const toggleMenu = (event: MouseEvent) => {
      event.preventDefault();
      menuTarget?.lastElementChild?.classList.toggle('text-brand');
      menu?.classList.toggle('hidden');
    };

    menuTarget?.addEventListener('click', toggleMenu);

    return () => {
      menuTarget?.removeEventListener('click', toggleMenu);
    };
  }, []);

  return (
    <div className="antialiased bg-gray-900 text-white">
      <header className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video src="img/video.mp4" autoPlay muted loop className="object-cover w-full h-full"></video>
        </div>

        <nav className="relative z-10 p-4 lg:px-16 flex items-center justify-between"  style={{ color: 'white' }}>
          <Link href="#">
            <img src="img/logo.jpg" alt="Cinema La Plata Logo" className="w-32" />
          </Link>
          <button data-menu-toggle className="lg:hidden block pr-1">
            <svg className="fill-current text-white w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path></svg>
          </button>
          <ul className="hidden lg:flex items-center space-x-6" data-menu>
            <li><Link href="#" className="text-white hover:text-gray-300">Inicio</Link></li>
            <li><Link href="#" className="text-white hover:text-gray-300">Cartelera</Link></li>
            <li><Link href="#" className="text-white hover:text-gray-300">Próximos estrenos</Link></li>
            <li><Link href="#" className="text-white hover:text-gray-300">Nosotros</Link></li>
            <li><Link href="#" className="text-white hover:text-gray-300">Contacto</Link></li>
          </ul>
        </nav>

        <div className="relative z-10 flex items-center justify-start h-full">
          <div className="text-center px-4">
            <h1 className="lg:text-6xl text-3xl font-bold mt-2 "  style={{ color: 'white' }}>Knights of Wales</h1>
            {/* <p className="text-lg mt-4 lg:max-w-3xl mx-auto">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo laboriosam quae mollitia voluptatibus placeat.</p> */}
            <Link href="#" className="mt-8 inline-flex items-center bg-brand text-white px-6 py-3 rounded-full text-white font-semibold text-lg">
              <FaPlay className="mr-2" /> Buy
            </Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto mt-12 lg:px-16 px-4">
      <h2 className="text-4xl font-semibold mb-4 text-center" style={{ color: 'white' }}>Ultimos estrenos</h2>

        <MovieSlider movies={movies} />
      </section>

      <section className="container mx-auto text-center py-12 lg:px-16 px-4">
        <h2 className="text-3xl font-bold mb-4">Sobre el cine arenas</h2>
        <p className="text-lg text-gray-400 mb-6">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem illum nulla, suscipit quibusdam nemo quod veniam saepe perferendis enim.</p>
        <Link href="#" className="text-brand">More info +</Link>
      </section>

      

    </div>
  );
};

export default CinemaLanding;
