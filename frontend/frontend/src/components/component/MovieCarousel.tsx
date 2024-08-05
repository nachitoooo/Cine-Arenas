import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import MovieCard from "./MovieCard";

interface Showtime {
  id: number;
  showtime: string;
}

interface Movie {
  id: number;
  image: string | null;
  title: string;
  description: string;
  hall_name: string;
  format: string;
  showtimes: Showtime[];
}

interface MovieCarouselProps {
  movies: Movie[];
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (newSlide: number) => {
    setCurrentSlide(newSlide);
  };

  return (
    <div className="relative">
      {movies[currentSlide]?.image && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center filter blur-lg"
          style={{
            backgroundImage: `url(${movies[currentSlide].image})`,
          }}
        ></div>
      )}
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode={false}
        className="carousel"
        containerClass="container-with-dots"
        draggable
        focusOnSelect={false}
        infinite
        itemClass="carousel-item-padding-40-px"
        keyBoardControl
        minimumTouchDrag={80}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5,
          },
          desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
          },
          tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
          },
          mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
          },
        }}
        showDots={true}
        sliderClass=""
        slidesToSlide={1}
        swipeable
        afterChange={(previousSlide, { currentSlide }) => handleSlideChange(currentSlide)}
      >
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            image={movie.image}
            title={movie.title}
            description={movie.description}
            hallName={movie.hall_name}
            format={movie.format}
            showtimes={movie.showtimes}
            isCurrent={index === currentSlide}
          />
        ))}
      </Carousel>
    </div>
  );
};

export default MovieCarousel;
