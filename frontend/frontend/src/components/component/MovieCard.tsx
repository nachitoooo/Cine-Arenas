import React, { useState } from "react";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { PiArmchairLight } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import Portal from "./portal";

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

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  image,
  title,
  description,
  hallName,
  format,
  showtimes,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatShowtime = (showtime: string) => {
    const date = new Date(showtime);
    return !isNaN(date.getTime()) ? date.toLocaleString() : showtime;
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <>
      <div className="max-w-xs w-full h-96 cursor-pointer m-2" onClick={openModal}>
        <div
          className="group w-full h-full overflow-hidden relative rounded-lg shadow-lg bg-cover bg-center bg-no-repeat transition-transform duration-500 hover:shadow-2xl hover:scale-105"
          style={{
            backgroundImage: `url(${image})`,
          }}
        >
          <div className="absolute top-0 left-0 right-0 p-4">
            {/* Puedes agregar más contenido aquí si es necesario */}
          </div>
        </div>
      </div>

      {isOpen && (
        <Portal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={closeModal}
          >
            <motion.div
              className="bg-gray-900 text-white rounded-lg shadow-2xl max-w-md w-full p-6 relative"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} // Esto previene que el clic dentro del modal cierre el modal
            >
              <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
                <h2 className="text-xl font-semibold">{title}</h2>
                <button onClick={closeModal} className="text-2xl" aria-label="Cerrar">
                  <FaTimes />
                </button>
              </div>
              <div>
                <p className="mb-4">{description}</p>
                <p className="mb-2">
                  <strong>Nombre de sala:</strong> {hallName}
                </p>
                <p className="mb-2">
                  <strong>Formato de la película:</strong> {format}
                </p>
                <div>
                  <strong>Horarios:</strong>
                  <ul className="list-disc pl-5 space-y-1">
                    {showtimes.map((showtimeObj) => (
                      <li key={showtimeObj.id}>{formatShowtime(showtimeObj.showtime)}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Link href={`/select-seats/${id}`} legacyBehavior>
                  <a className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105">
                    <PiArmchairLight className="mr-2" />
                    Seleccionar asientos
                  </a>
                </Link>
                <button
                  onClick={closeModal}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default MovieCard;
