import React, { useEffect } from "react";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import 'tailwindcss/tailwind.css';
import MovieSlider from "./slider";


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
    <div className="antialiased bg-black text-white">
      <header className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video src="img/video.mp4" autoPlay muted loop className="object-cover w-full h-full"></video>
        </div>

        <nav className="relative z-10 p-4 lg:px-16 flex items-center justify-between bg-black bg-opacity-50">
          <Link href="#">
            <img src="img/logo.jpg" alt="Cinema La Plata Logo" className="w-32" />
          </Link>
          <button data-menu-toggle className="lg:hidden block pr-1">
            <svg className="fill-current text-white w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path></svg>
          </button>
          <ul className="hidden lg:flex items-center space-x-6 text-white" data-menu>
            <li><Link href="#">Home</Link></li>
            <li><Link href="#">Cines</Link></li>
            <li><Link href="#">Cartelera</Link></li>
            <li><Link href="#">Preventa</Link></li>
            <li><Link href="#">Futuros</Link></li>
            <li><Link href="#">Precios</Link></li>
            <li><Link href="#">Nosotros</Link></li>
            <li><Link href="#">Contacto</Link></li>
          </ul>
        </nav>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center px-4">
            <p className="text-base font-light leading-none">Out now</p>
            <h1 className="lg:text-6xl text-3xl font-bold mt-2">Knights of Wales</h1>
            <p className="text-lg mt-4 lg:max-w-3xl mx-auto">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo laboriosam quae mollitia voluptatibus placeat.</p>
            <Link href="#" className="mt-8 inline-block bg-brand text-white px-6 py-3 rounded-full text-white">Stream/Buy</Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto mt-12 lg:px-16 px-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">Últimos estrenos</h2>
        <MovieSlider movies={movies} />
      </section>

      <section className="container mx-auto text-center py-12 lg:px-16 px-4">
        <h2 className="text-3xl font-bold mb-4">About GSL Productions</h2>
        <p className="text-lg text-gray-400 mb-6">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem illum nulla, suscipit quibusdam nemo quod veniam saepe perferendis enim.</p>
        <Link href="#" className="text-brand">More info +</Link>
      </section>

      <section className="relative text-center text-white py-12 px-4" style={{ backgroundImage: 'url(img/video-bg-image.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <h3 className="text-3xl font-bold mb-4">Releases Coming Soon</h3>
        <Link href="#" className="inline-flex items-center justify-center text-white w-auto hover:opacity-75 mb-4">
          <svg className="fill-current text-white w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>ic_play_circle_outline_48px</title><path d="M20 33l12-9-12-9v18zm4-29C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16z" /></svg>
          <span className="ml-2 pb-1 border-b border-white">Play Video</span>
        </Link>
        <Link href="#" className="inline-flex items-center justify-center text-white border bg-transparent px-8 py-3 hover:bg-white hover:text-black rounded-full">All Videos +</Link>
      </section>

      <footer className="container mx-auto text-center text-white py-8 lg:px-16 px-4">
        <h3 className="text-3xl font-bold mb-4">See it First</h3>
        <form action="#" className="mb-8">
          <div className="flex justify-center items-center">
            <input type="email" className="bg-transparent border px-4 py-3 w-1/3" placeholder="Enter your email here*" />
            <input type="submit" className="bg-brand text-white px-6 py-3 ml-4 rounded-full" value="Subscribe" />
          </div>
        </form>
        <div className="flex justify-center space-x-4 mb-4">
          <Link href="#"><FaInstagram className="text-white opacity-50 hover:opacity-75" /></Link>
          <Link href="#"><FaYoutube className="text-white opacity-50 hover:opacity-75" /></Link>
          <Link href="#"><FaFacebookF className="text-white opacity-50 hover:opacity-75" /></Link>
          <Link href="#"><FaTwitter className="text-white opacity-50 hover:opacity-75" /></Link>
        </div>
        <p className="text-sm text-gray-400">&copy; 2024 Cinema La Plata. Proudly copied from Wix.com.</p>
      </footer>
    </div>
  );
};

export default CinemaLanding;
