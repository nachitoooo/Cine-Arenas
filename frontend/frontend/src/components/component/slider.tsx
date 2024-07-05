import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../../app/slider.css";
import "../../app/globals.css";

import Image from "next/image";
import Link from "next/link";
import "tailwindcss/tailwind.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 3,
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 2,
    slidesToSlide: 1,
  },
};

interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  image: string | null;
}

interface MovieSliderProps {
  movies: Movie[];
}

const MovieSlider: React.FC<MovieSliderProps> = ({ movies }) => {
  return (
    <div className="parent flex flex-wrap justify-center gap-4">
      {movies.map((movie) => (
        <div className="slider" key={movie.id}>
          <div className="relative cursor-pointer max-w-sm bg-white border border-black rounded-lg  dark:bg-gray-800 dark:border-black w-64 h-80 transition duration-300 ease-in-out transform hover:scale-105">
            {movie.image ? (
              <a href={`/select-seats/${movie.id}`}>
                <img
                  className="rounded-t-lg w-full h-full object-cover"
                  src={movie.image}
                  alt={movie.title}
                />
              </a>
            ) : (
              <div className="bg-gray-800 w-full h-64 flex items-center justify-center rounded-t-lg">
                <p className="text-white">Imagen no disponible</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieSlider;
