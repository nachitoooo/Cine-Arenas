import React, { useEffect } from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import MovieCard from "./MovieCard";
import "tailwindcss/tailwind.css";
import CinemaCarousel from "./cinema-carousel";
import CinemaNavbar from "./cinema-navbar"; // Importa el nuevo componente de navbar
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Showtime {
  id: number;
  showtime: string;
}

interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  image: string | null;
  hall_name: string;
  format: string;
  showtimes: Showtime[];
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    centerMode: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  return (
    <div className="antialiased bg-black text-gray-200">
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

        <CinemaNavbar /> {/* Utiliza el nuevo componente de navbar */}
      </header>

      <section className="container mx-auto mt-12 lg:px-16 px-4">
        <h2
          className="mt-12 text-5xl font-semibold mb-12 text-center"
          style={{ color: "white" }}
        >
          Películas disponibles en cartelera
        </h2>

        {/* Renderizar imágenes de la cartelera */}
        <Slider className="mx-auto" {...settings}  > 
          {movies.map((movie) => (
            <div key={movie.id} >
              <MovieCard
                id={movie.id}
                image={movie.image}
                title={movie.title}
                description={movie.description}
                hallName={movie.hall_name}
                format={movie.format}
                showtimes={movie.showtimes}
              />
            </div>
          ))}
        </Slider>
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
