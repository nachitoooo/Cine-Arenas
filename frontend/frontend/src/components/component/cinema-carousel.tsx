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
          <Carousel.Item key={movie.id} style={{ height: '100vh' }}>
            <div
              style={{
                height: '100%',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                className="d-block w-100"
                src={movie.image || "https://via.placeholder.com/1920x1080"}
                alt={movie.title}
                style={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.7)',
                }}
              />
            </div>
            <div
              className="absolute left-0 right-0 p-3"
              style={{
                bottom: '15%',
                background: 'rgba(0, 0, 0, 0.4)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                maxWidth: '80%',
                margin: '0 auto',
                borderRadius: '10px',
              }}
            >
              <div className="mr-3">
                <img
                  src={movie.image || "https://via.placeholder.com/150x200"}
                  alt={movie.title}
                  style={{
                    width: '70px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '5px',
                  }}
                />
              </div>
              <div>
                <h5>{movie.title}</h5>
                <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>{movie.description}</p>
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
