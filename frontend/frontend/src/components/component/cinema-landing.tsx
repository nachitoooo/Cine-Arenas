import Link from "next/link";
import Image from "next/image";
import { FaFilm, FaCouch, FaVolumeUp } from 'react-icons/fa';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { GiPopcorn } from "react-icons/gi";

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

const CinemaLanding = ({ movies }: CinemaLandingProps) => {
  return (
    <div className="flex flex-col min-h-[100vh] bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center text-white text-2xl font-bold">
            <FaFilm className="mr-2" />
            Acme Cinema
          </Link>
          <nav className="flex space-x-4">
            <Link href="#" className="hover:text-gray-400">Showtimes</Link>
            <Link href="#" className="hover:text-gray-400">Concessions</Link>
            <Link href="#" className="hover:text-gray-400">About</Link>
            <Link href="#" className="hover:text-gray-400">Contact</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 text-center">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex justify-center items-center lg:order-last">
                <Image
                  src="/placeholder.svg"
                  width={650}
                  height={650}
                  alt="Cinema Exterior"
                  className="rounded-xl shadow-lg"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">Acme Cinema</h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Experience the latest blockbusters in unparalleled comfort and style.
                </p>
                <Link
                  href="#"
                  className="inline-flex items-center justify-center rounded-md bg-red-600 px-8 py-3 text-lg font-medium text-white shadow-lg hover:bg-red-700"
                >
                  Buy Tickets
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32 bg-gray-800 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Experience the Difference</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mt-4">
              Acme Cinema offers the ultimate movie-going experience with our state-of-the-art facilities,
              comfortable seating, and wide selection of concessions.
            </p>
            <div className="grid gap-6 mt-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4">
                <FaCouch className="h-12 w-12 text-red-600" />
                <h3 className="text-xl font-bold">Comfortable Seating</h3>
                <p className="text-gray-400">
                  Sink into our plush, reclining seats for the ultimate relaxation.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <FaVolumeUp className="h-12 w-12 text-red-600" />
                <h3 className="text-xl font-bold">State-of-the-Art Sound</h3>
                <p className="text-gray-400">
                  Immerse yourself in the action with our cutting-edge sound system.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <GiPopcorn className="h-12 w-12 text-red-600" />
                <h3 className="text-xl font-bold">Delicious Concessions</h3>
                <p className="text-gray-400">
                  Indulge in a wide variety of snacks and refreshments to enhance your movie experience.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold tracking-tight text-center sm:text-5xl">Now Playing & Upcoming</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mt-4 text-center">
              Check out our current and upcoming movie lineup, with showtimes and ticket information.
            </p>
            <div className="grid gap-6 mt-12 lg:grid-cols-3 lg:gap-12">
              {movies.map((movie) => (
                <div key={movie.id} className="flex flex-col items-center space-y-4">
                  {movie.image && (
                    <Image
                      src={movie.image}
                      width={200}
                      height={300}
                      alt={movie.title}
                      className="rounded-xl shadow-lg"
                    />
                  )}
                  <h3 className="text-xl font-bold">{movie.title}</h3>
                  <p className="text-gray-300">{movie.description}</p>
                  <p className="text-gray-400"><strong>Fecha de Estreno:</strong> {movie.release_date}</p>
                  <Link
                    href="#"
                    className="inline-flex items-center justify-center rounded-md bg-red-600 px-6 py-2 text-sm font-medium text-white shadow-lg hover:bg-red-700"
                  >
                    Buy Tickets
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto px-4 flex flex-col items-center space-y-4 text-center sm:flex-row sm:space-y-0 sm:justify-between">
          <p className="text-xs text-gray-400">&copy; 2024 Acme Cinema. All rights reserved.</p>
          <nav className="flex space-x-4">
            <Link href="#" className="text-xs hover:underline text-gray-400">Address: 123 Main St, Anytown USA</Link>
            <Link href="#" className="text-xs hover:underline text-gray-400">Phone: (555) 555-5555</Link>
            <Link href="#" className="text-xs hover:underline text-gray-400">Email: info@acmecinema.com</Link>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Follow Us:</span>
              <Link href="#" className="text-xs hover:text-red-600 text-gray-400">
                <FaFacebookF />
              </Link>
              <Link href="#" className="text-xs hover:text-red-600 text-gray-400">
                <FaTwitter />
              </Link>
              <Link href="#" className="text-xs hover:text-red-600 text-gray-400">
                <FaInstagram />
              </Link>
            </div>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default CinemaLanding;
