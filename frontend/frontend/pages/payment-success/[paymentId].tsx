// paymentId.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import { QRCodeSVG } from 'qrcode.react';

interface Seat {
  row: string;
  number: number;
}

interface Invoice {
  movie_title: string;
  seats: Seat[];
  total_amount: number;
  invoice_id: string;
  hall_name: string;
  format: string;
  showtime: string;
}

const PaymentSuccess = () => {
  const router = useRouter();
  const { preference_id } = router.query;
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (preference_id) {
      axios.get(`http://localhost:8000/api/payment-success/?preference_id=${preference_id}`)
        .then(response => {
          setInvoice(response.data);
        })
        .catch(error => {
          console.error('Error al obtener los datos de la factura:', error);
        });
    }
  }, [preference_id]);

  if (!invoice) return <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>Cargando factura...</div>;

  const handlePrint = () => {
    window.print();
  };

  const qrValue = `Invoice ID: ${invoice.invoice_id}\nMovie: ${invoice.movie_title}\nTotal: $${invoice.total_amount}`;

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#ffffff', 
      color: '#333', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <div style={{ 
        backgroundColor: '#ffffff', 
        color: '#333', 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
        maxWidth: '800px', 
        width: '100%',
        textAlign: 'left'
      }}>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#2d3748' }}>Película: {invoice.movie_title}</h3>
          <h4 style={{ fontSize: '1.2rem', color: '#2d3748' }}>Sala: {invoice.hall_name}</h4>
          <h4 style={{ fontSize: '1.2rem', color: '#2d3748' }}>Formato: {invoice.format}</h4>
          <h4 style={{ fontSize: '1.2rem', color: '#2d3748' }}>Horario: {new Date(invoice.showtime).toLocaleString()}</h4>
          <h4 style={{ fontSize: '1.2rem', color: '#2d3748' }}>Número de asiento:</h4>
          <ul style={{ listStyleType: 'disc', paddingInlineStart: '20px', color: '#2d3748' }}>
            {invoice.seats.map((seat, index) => (
              <li key={index}>{seat.row}{seat.number}</li>
            ))}
          </ul>
        </div>
        <div style={{ marginBottom: '20px', borderTop: '2px solid #e2e8f0', paddingTop: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '2px solid #e2e8f0', padding: '10px 0', textAlign: 'left' }}>CANT.</th>
                <th style={{ borderBottom: '2px solid #e2e8f0', padding: '10px 0', textAlign: 'left' }}>DESCRIPCIÓN</th>
                <th style={{ borderBottom: '2px solid #e2e8f0', padding: '10px 0', textAlign: 'right' }}>IMPORTE</th>
              </tr>
            </thead>
            <tbody>
              {invoice.seats.map((seat, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px 0' }}>1</td>
                  <td style={{ padding: '10px 0' }}>{seat.row}{seat.number}</td>
                  <td style={{ padding: '10px 0', textAlign: 'right' }}>${invoice.total_amount}</td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#2d3748' }}>TOTAL: ${invoice.total_amount}</h3>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '20px', display:'flex', justifyContent:'center' }}>
          <QRCodeSVG value={qrValue} size={128} />
        </div>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button 
            onClick={handlePrint} 
            style={{ 
              padding: '10px 20px', 
              fontSize: '1rem', 
              color: '#fff', 
              backgroundColor: '#4A90E2', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}>
            Imprimir Ticket
          </button>
        </div>
        <div style={{ textAlign: 'center', borderTop: '2px solid #e2e8f0', paddingTop: '10px' }}>
          <p>Cine arenas - San Bernardo del Tuyú</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
