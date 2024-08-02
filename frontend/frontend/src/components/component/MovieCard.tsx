import { cn } from "@/lib/utils";
import Link from "next/link";

interface Showtime {
  id: number;
  showtime: string;
}

interface MovieCardProps {
  id: number;
  image: string | null;
  title: string;
  description: string;
  hallName: string;
  format: string;
  showtimes: Showtime[];
}

export function MovieCard({ id, image, title, description, hallName, format, showtimes }: MovieCardProps) {
  const formatShowtime = (showtime: string) => {
    const date = new Date(showtime);
    return !isNaN(date.getTime()) ? date.toLocaleString() : showtime;
  };

  return (
    <div className="max-w-xs w-full">
      <div
        className={cn(
          "group w-full cursor-pointer overflow-hidden relative card h-auto rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
          "before:fixed before:inset-0 before:opacity-0 before:z-[-1]",
          "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-30",
          "transition-all duration-500"
        )}
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text relative z-50">
          <h1 className="font-bold text-xl md:text-3xl text-gray-50 relative">
            {title}
          </h1>
          <p className="font-normal text-base text-gray-50 relative my-4">
            {description}
          </p>
          <p className="font-normal text-base text-gray-50 relative my-4">
            <strong>Sala:</strong> {hallName}
          </p>
          <p className="font-normal text-base text-gray-50 relative my-4">
            <strong>Formato:</strong> {format}
          </p>
          <div className="font-normal text-base text-gray-50 relative my-4">
            <strong>Horarios:</strong>
            <ul>
              {showtimes.map((showtimeObj) => (
                <li key={showtimeObj.id}>{formatShowtime(showtimeObj.showtime)}</li>
              ))}
            </ul>
          </div>
          <Link href={`/select-seats/${id}`} legacyBehavior>
            <a className="text-white bg-blue-500 px-4 py-2 rounded">Seleccionar Asientos</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
