// PaymentSuccess.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface Seat {
    row: string;
    number: number;
}

interface Invoice {
    movie_title: string;
    seats: Seat[];
    total_amount: number;
}

const PaymentSuccess = () => {
  const router = useRouter();
  const { preference_id } = router.query;
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (preference_id) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payment-success/?preference_id=${preference_id}`)
        .then(response => {
          setInvoice(response.data);
        })
        .catch(error => {
          console.error('Error fetching invoice data:', error);
        });
    }
  }, [preference_id]);

  if (!invoice) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold">Payment Success</h1>
        <h2 className="text-xl mt-4">Movie: {invoice.movie_title}</h2>
        <h3 className="text-lg mt-2">Seats:</h3>
        <ul className="list-disc list-inside">
          {invoice.seats.map((seat, index) => (
            <li key={index}>{seat.row}{seat.number}</li>
          ))}
        </ul>
        <h3 className="text-lg mt-2">Total Amount: ${invoice.total_amount}</h3>
      </div>
    </div>
  );
};

export default PaymentSuccess;
