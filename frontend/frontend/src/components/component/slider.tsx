import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import '../../app/slider.css'; 
import '../../app/globals.css'; 

import Image from "next/image";
import Link from "next/link";
import 'tailwindcss/tailwind.css';

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
    <div className="parent">
      <Carousel
        responsive={responsive}
        autoPlay={true}
        swipeable={true}
        draggable={true}
        showDots={true}
        infinite={true}
        partialVisible={false}
        dotListClass="custom-dot-list-style"
      >
        {movies.map((movie) => (
          <div className="slider" key={movie.id}>
            {movie.image ? (
              <Image
                src={movie.image}
                alt={movie.title}
                width={300}
                height={450}
                className="slider-image"
              />
            ) : (
              <div className="bg-gray-800 w-full h-72 flex items-center justify-center">
                <p>No Image Available</p>
              </div>
            )}
            <div className="mt-4 text-center">
              <Link href={`/select-seats/${movie.id}`} legacyBehavior>
                <a className="bg-brand text-white px-6 py-3 " style={{ borderRadius: '10px' }} >Comprar entrada</a>
              </Link>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MovieSlider;
