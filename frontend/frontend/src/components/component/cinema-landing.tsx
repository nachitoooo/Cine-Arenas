// components/CinemaLanding.tsx
import Link from 'next/link';
import Image from 'next/image';
import { FaFilm, FaCouch, FaVolumeUp } from 'react-icons/fa';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { GiPopcorn } from 'react-icons/gi';
import 'tailwindcss/tailwind.css';

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
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center">
          <FaFilm className="h-6 w-6" />
          <span className="sr-only">Acme Cinema</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Showtimes
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Concessions
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]">
              <Image
                src="/placeholder.svg"
                width={650}
                height={650}
                alt="Cinema Exterior"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Acme Cinema</h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Experience the latest blockbusters in unparalleled comfort and style.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Buy Tickets
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Experience the Difference</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Acme Cinema offers the ultimate movie-going experience with our state-of-the-art facilities,
                  comfortable seating, and wide selection of concessions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center justify-center space-y-2">
                <FaCouch className="h-12 w-12" />
                <h3 className="text-xl font-bold">Comfortable Seating</h3>
                <p className="text-muted-foreground">
                  Sink into our plush, reclining seats for the ultimate relaxation.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <FaVolumeUp className="h-12 w-12" />
                <h3 className="text-xl font-bold">State-of-the-Art Sound</h3>
                <p className="text-muted-foreground">
                  Immerse yourself in the action with our cutting-edge sound system.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <GiPopcorn className="h-12 w-12" />
                <h3 className="text-xl font-bold">Delicious Concessions</h3>
                <p className="text-muted-foreground">
                  Indulge in a wide variety of snacks and refreshments to enhance your movie experience.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Now Playing & Upcoming</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Check out our current and upcoming movie lineup, with showtimes and ticket information.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {movies.map((movie) => (
                <div key={movie.id} className="flex flex-col items-center justify-center space-y-2">
                  {movie.image && (
                    <Image
                      src={movie.image}
                      width={200}
                      height={300}
                      alt={movie.title}
                      className="aspect-[2/3] overflow-hidden rounded-xl object-cover"
                    />
                  )}
                  <h3 className="text-xl font-bold">{movie.title}</h3>
                  <p className="text-muted-foreground">{movie.description}</p>
                  <p className="text-muted-foreground"><strong>Fecha de Estreno:</strong> {movie.release_date}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Acme Cinema. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Address: 123 Main St, Anytown USA
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Phone: (555) 555-5555
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Email: info@acmecinema.com
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs">Follow Us:</span>
            <Link href="#" className="text-xs hover:text-primary">
              <FaFacebookF />
            </Link>
            <Link href="#" className="text-xs hover:text-primary">
              <FaTwitter />
            </Link>
            <Link href="#" className="text-xs hover:text-primary">
              <FaInstagram />
            </Link>
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default CinemaLanding;
