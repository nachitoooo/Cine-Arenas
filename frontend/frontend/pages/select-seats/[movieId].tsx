import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css';
import SeatSelection from '@/components/component/SeatSelection';

const SelectSeats = () => {
  const router = useRouter();
  const { movieId } = router.query;

  if (!movieId) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-12">
        <SeatSelection movieId={movieId as string} />
      </div>
    </div>
  );
};

export default SelectSeats;
