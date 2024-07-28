import React, { useEffect } from "react";
import Link from "next/link";
import { FaInfoCircle, FaBars, FaPlay } from "react-icons/fa";
import { MovieCard } from "./MovieCard"; // Asegúrate de importar el componente MovieCard
import CinemaCarousel from "./cinema-carousel";
import "tailwindcss/tailwind.css";

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
    const menuTarget = document.querySelector(
      "[data-menu-toggle]"
    ) as HTMLElement;
    const menu = document.querySelector("[data-menu]") as HTMLElement;

    const toggleMenu = (event: MouseEvent) => {
      event.preventDefault();
      menuTarget?.lastElementChild?.classList.toggle("text-brand");
      menu?.classList.toggle("hidden");
    };

    menuTarget?.addEventListener("click", toggleMenu);

    return () => {
      menuTarget?.removeEventListener("click", toggleMenu);
    };
  }, []);

  return (
    <div className="antialiased bg-gray-900 text-white">
      <header className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CinemaCarousel movies={movies} />
          <div
            className="absolute inset-0 z-10"
            style={{
              background: `
                linear-gradient(180deg, rgba(0, 0, 0, 0.6), transparent 50%),
                linear-gradient(0deg, rgba(0, 0, 0, 0.6), transparent 50%),
                linear-gradient(90deg, rgba(0, 0, 0, 0.6), transparent 50%),
                linear-gradient(270deg, rgba(0, 0, 0, 0.6), transparent 50%)
              `,
            }}
          ></div>
        </div>

        <nav className="relative z-20 p-4 lg:px-16 flex items-center justify-between bg-gradient-to-b from-black to-transparent">
          <Link href="#">
            <img
              src="img/logo.jpg"
              style={{ filter: "invert(1)", marginLeft: "1rem" }}
              alt="Cine Arenas"
              className="w-32"
            />
          </Link>
          <button data-menu-toggle className="lg:hidden block pr-1">
            <FaBars className="fill-current text-white w-6 h-6" />
          </button>
          <ul
            className="lg:flex flex-grow items-center justify-center space-x-24 text-lg font-medium navbar-font hidden"
            data-menu
          >
            <li>
              <Link href="#" className="text-white hover:text-gray-300">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="#" className="text-white hover:text-gray-300">
                Cartelera
              </Link>
            </li>
            <li>
              <Link href="#" className="text-white hover:text-gray-300">
                Próximos estrenos
              </Link>
            </li>
            <li>
              <Link href="#" className="text-white hover:text-gray-300">
                Nosotros
              </Link>
            </li>
            {/* <li><Link href="#" className="text-white hover:text-gray-300">Contacto</Link></li> */}
          </ul>
        </nav>
      </header>

      <section className="container mx-auto mt-12 lg:px-16 px-4">
        <h2
          className="mt-12 text-4xl font-semibold mb-4 text-center"
          style={{ color: "white" }}
        >
          Cartelera - Próximos estrenos
        </h2>

        {/* Renderizar imágenes de la cartelera */}
        <div className="flex flex-wrap justify-center gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              image={movie.image}
              title={movie.title}
              description={movie.description}
            />
          ))}
        </div>
      </section>

      <footer className="rounded-lg shadow dark:bg-gray-900">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a
              href="/"
              className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
            >
              <img
                src="img/logo.jpg"
                className="h-8"
                alt="Flowbite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Cine Arenas
              </span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Cartelera
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Candy Bar
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Ayuda
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024{" "}
            <a href="#" className="hover:underline">
              Cine Arenas
            </a>
            . Todos los derechos reservados.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default CinemaLanding;