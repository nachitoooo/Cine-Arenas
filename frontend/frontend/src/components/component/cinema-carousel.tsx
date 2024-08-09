import React, { useRef } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  image: string | null;
  cinema_listing: string | null;

}

interface CinemaCarouselProps {
  movies: Movie[];
}

const CinemaCarousel: React.FC<CinemaCarouselProps> = ({ movies }) => {
  const carouselRef = useRef<any>(null);

  const handlePrevClick = () => {
    carouselRef.current?.prev?.();
  };

  const handleNextClick = () => {
    carouselRef.current?.next?.();
  };

  return (
    <div className="relative">
      <Carousel
        ref={carouselRef}
        controls={false}
        indicators={false}
        interval={3000}
      >
        {movies.map((movie) => (
          <Carousel.Item key={movie.id} className="h-screen">
            <div className="h-full w-full relative overflow-hidden">
              <img
                className="h-full w-full object-cover filter brightness-50"
                src={movie.image || "https://via.placeholder.com/1920x1080"}
                alt={movie.title}
              />
            </div>
            <div className="absolute left-0 bottom-[10%] bg-black text-white max-w-2xl p-6 rounded-r-lg flex">
              <img
                src={movie.cinema_listing || "https://via.placeholder.com/150x200"}
                alt={movie.title}
                className="w-32 h-46 object-cover rounded-md mr-4"
              />
              <div>
                <h3 className="text-3xl font-bold mb-4">{movie.title}</h3>
                <p className="text-lg">{movie.description}</p>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      <button
        onClick={handlePrevClick}
        className="flex items-center justify-center w-12 h-12 bg-transparent text-white absolute top-1/2 transform -translate-y-1/2 left-4 z-50"
      >
        <FaChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNextClick}
        className="flex items-center justify-center w-12 h-12 bg-transparent text-white absolute top-1/2 transform -translate-y-1/2 right-4 z-50"
      >
        <FaChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default CinemaCarousel;
