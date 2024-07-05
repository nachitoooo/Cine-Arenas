import React, { useEffect } from "react";
import Link from "next/link";
import { FaInfoCircle, FaShoppingCart, FaBars, FaPlay } from "react-icons/fa";
import MovieSlider from "./slider";
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
          <video
            src="img/video.mp4"
            autoPlay
            muted
            loop
            className="object-cover w-full h-full"
          ></video>
          <div
            className="absolute inset-0"
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

        <nav className="relative z-10 p-4 lg:px-16 flex items-center justify-between bg-gradient-to-b from-black to-transparent">
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
            className=" lg:flex flex-grow items-center justify-center space-x-24 text-lg font-medium navbar-font"
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

        <div className="relative z-10 flex items-center justify-start h-full">
          <div className="text-center px-4 mt-24 ml-24 lg:mt-32 mb-28">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/1c/Inside_Out_2_logo.svg"
              alt="Inside Out 2 Logo"
              className="max-w-xl mx-auto"
              style={{
                filter: "invert(1)",
                maxWidth: "22rem",
                marginLeft: "3rem",
              }}
            />
            <div className="ml-12 mt-14 mb-14 inline-flex items-center space-x-4">
              <Link
                href="#"
                className="inline-flex items-center bg-white text-black px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-gray-200 transition duration-300"
              >
                <FaPlay className="mr-2" /> Reservar
              </Link>
              <Link
                href="#"
                className="inline-flex items-center bg-white text-black px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-gray-200 transition duration-300"
              >
                <FaInfoCircle className="mr-2" /> Más información
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="container mx-auto mt-12 lg:px-16 px-4">
        <h2
          className="mt-12 text-4xl ml-28 font-semibold mb-4 text-left"
          style={{ color: "white" }}
        >
          Cartelera
        </h2>
        <MovieSlider movies={movies} />
      </section>

      <footer className=" rounded-lg shadow dark:bg-gray-900">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a
              href="https://flowbite.com/"
              className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
            >
              <img
                src="https://flowbite.com/docs/images/logo.svg"
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
