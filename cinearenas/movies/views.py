# Importaciones necesarias desde el framework Django REST y otros módulos relevantes
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders 
from rest_framework import viewsets, generics, filters, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.authtoken.views import obtain_auth_token
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import logout
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
import mercadopago
from datetime import datetime  # Asegúrate de importar correctamente la clase datetime
from django.utils.dateparse import parse_datetime
from django.utils import timezone
import pytz
from django.conf import settings
from .models import Movie, Seat, Reservation, Showtime, Payment, User
from .serializers import MovieSerializer, SeatSerializer, ReservationSerializer, ShowtimeSerializer, PaymentSerializer
from django.shortcuts import render
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt
import os
# ------------------------ ViewSet para manejar las operaciones CRUD en el modelo Movie ------------------------
class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        image_path = instance.image.path if instance.image else None
        cinema_listing_path = instance.cinema_listing.path if instance.cinema_listing else None

        self.perform_destroy(instance)

        if image_path and os.path.isfile(image_path):
            os.remove(image_path)
        
        if cinema_listing_path and os.path.isfile(cinema_listing_path):
            os.remove(cinema_listing_path)

        return Response(status=status.HTTP_204_NO_CONTENT)

# ------------------------ ViewSet para manejar las operaciones CRUD en el modelo Showtime ------------------------
class ShowtimeViewSet(viewsets.ModelViewSet):
    queryset = Showtime.objects.all()
    serializer_class = ShowtimeSerializer
    permission_classes = [IsAuthenticated]

# ------------------------ ViewSet para manejar las operaciones CRUD en el modelo Seat ------------------------
class SeatViewSet(viewsets.ModelViewSet):
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['movie__id']
    permission_classes = [AllowAny]

    def get_queryset(self):
        movie_id = self.request.query_params.get('movie_id', None)
        if movie_id is not None:
            return Seat.objects.filter(movie_id=movie_id)
        return super().get_queryset()

# ------------------------ ViewSet para manejar las operaciones CRUD en el modelo Reservation ------------------------
class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        seats = self.request.data.get('seats')
        if not seats:
            raise ValidationError('No seats selected')
        
        user = self.request.user if self.request.user.is_authenticated else None
        reservation = serializer.save(user=user)
        
        for seat_id in seats:
            seat = Seat.objects.get(id=seat_id)
            seat.is_reserved = True
            seat.save()
            reservation.seats.add(seat)
        reservation.save()

# ------------------------ Crear película ------------------------
class MovieListCreate(generics.ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]

# ------------------------ Obtener, actualizar, eliminar y editar una película ------------------------
class MovieDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]

# ----------------------- Petición para devolver el CSRF token en JSON ---------------------
@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'csrfToken': request.META.get('CSRF_COOKIE', '')})

# --------------- Obtener el token de autenticación y devolver información adicional del usuario -------------------
class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user_id': user.pk, 'email': user.email})
        except AuthenticationFailed:
            return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
        
class PaymentListView(generics.ListAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]  # Si deseas que solo los usuarios autenticados puedan ver los pagos        

# ------------------------ Logout -------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def user_logout(request):
    try:
        request.user.auth_token.delete()
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)
    except AttributeError:
        return Response({'error': 'El usuario no tiene un token de autenticación'}, status=status.HTTP_400_BAD_REQUEST)

# ------------------------ Envío de correos electrónicos -------------------------------
def send_invoice_email(email, invoice_data):
    from_email = settings.EMAIL_HOST_USER
    to_email = email
    subject = 'Tu factura de Cine Arenas'
    body = f"""
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #ffffff; color: #333; font-family: Arial, sans-serif;">
      <div style="background-color: #ffffff; color: #333; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 800px; width: 100%; text-align: left;">
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 1.5rem; color: #2d3748;">Película: {invoice_data['movie_title']}</h3>
          <h4 style="font-size: 1.2rem; color: #2d3748;">Sala: {invoice_data['hall_name']}</h4>
          <h4 style="font-size: 1.2rem; color: #2d3748;">Formato: {invoice_data['format']}</h4>
          <h4 style="font-size: 1.2rem; color: #2d3748;">Horario: {invoice_data['showtime']}</h4>
          <h4 style="font-size: 1.2rem; color: #2d3748;">Número de asiento:</h4>
          <ul style="list-style-type: disc; padding-inline-start: 20px; color: #2d3748;">
            {''.join([f"<li>{seat['row']}{seat['number']}</li>" for seat in invoice_data['seats']])}
          </ul>
        </div>
        <div style="margin-bottom: 20px; border-top: 2px solid #e2e8f0; padding-top: 10px;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border-bottom: 2px solid #e2e8f0; padding: 10px 0; text-align: left;">CANT.</th>
                <th style="border-bottom: 2px solid #e2e8f0; padding: 10px 0; text-align: left;">DESCRIPCIÓN</th>
                <th style="border-bottom: 2px solid #e2e8f0; padding: 10px 0; text-align: right;">IMPORTE</th>
              </tr>
            </thead>
            <tbody>
              {''.join([f"<tr><td style='padding: 10px 0;'>1</td><td style='padding: 10px 0;'>{seat['row']}{seat['number']}</td><td style='padding: 10px 0; text-align: right;'>${invoice_data['ticket_price']}</td></tr>" for seat in invoice_data['seats']])}
            </tbody>
          </table>
        </div>
        <div style="text-align: right; margin-bottom: 20px;">
          <h3 style="font-size: 1.5rem; color: #2d3748;">TOTAL: ${invoice_data['total_amount']}</h3>
        </div>

        <div style="text-align: center; border-top: 2px solid #e2e8f0; padding-top: 10px;">
          <p>Cine arenas - San Bernardo del Tuyú</p>
        </div>
      </div>
    </div>
    """

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))

    try:
        server = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
        server.starttls()
        server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()
        print("Email sent successfully")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

# ------------------------ Crear y gestionar pagos -------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def create_payment(request):
    sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

    email = request.data.get('email')
    seats = request.data.get('seats', [])
    format = request.data.get('format')
    showtime_id = request.data.get('showtime_id')

    if not email or not seats or not format or not showtime_id:
        return Response({"error": "Email, seats, format, and showtime_id are required for payment"}, status=status.HTTP_400_BAD_REQUEST)

    seat_objects = Seat.objects.filter(id__in=seats)
    movie_id = seat_objects.first().movie_id if seat_objects.exists() else None
    movie = Movie.objects.get(id=movie_id) if movie_id else None
    showtime = Showtime.objects.get(id=showtime_id)

    ticket_price = 100.00
    argentina_tz = pytz.timezone('America/Argentina/Buenos_Aires')
    showtime_local = showtime.showtime.astimezone(argentina_tz)

    # Crear la preferencia de MercadoPago
    preference_data = {
        "items": [
            {
                "title": f"Movie Ticket for {movie.title}",
                "quantity": len(seats),
                "unit_price": ticket_price
            }
        ],
        "payer": {
            "email": email,
        },
        "back_urls": {
            "success": f"http://localhost:3000/payment-success/{{preference_id}}",
            "failure": "http://localhost:3000/payment-failure",
            "pending": "http://localhost:3000/payment-pending"
        },
        "auto_return": "approved",
        "metadata": {
            "movie_title": movie.title,
            "seats": [{"row": seat.row, "number": seat.number} for seat in seat_objects],
            "total_amount": ticket_price * len(seats),
            "ticket_price": ticket_price,
            "hall_name": movie.hall_name,
            "format": format,
            "showtime": showtime_local.strftime('%Y-%m-%dT%H:%M:%S')
        }
    }

    preference_response = sdk.preference().create(preference_data)
    preference = preference_response["response"]

    print(f"Preference data sent to MercadoPago: {preference_data}")
    print(f"Preference response from MercadoPago: {preference}")

    # Crear un objeto de Payment en la base de datos con la información básica
    payment = Payment.objects.create(
        movie=movie,
        amount=ticket_price * len(seats),
        status="pending"  # El estado inicial es pendiente hasta que MercadoPago lo confirme
    )

    for seat in seat_objects:
        payment.seats.add(seat)

    payment.save()

    # Enviar el correo electrónico
    invoice_data = {
        "movie_title": movie.title,
        "seats": [{"row": seat.row, "number": seat.number} for seat in seat_objects],
        "total_amount": ticket_price * len(seats),
        "ticket_price": ticket_price,
        "hall_name": movie.hall_name,
        "format": format,
        "showtime": showtime_local.strftime('%Y-%m-%d %H:%M:%S')
    }
    if send_invoice_email(email, invoice_data):
        print("Email sent successfully")
    else:
        print("Failed to send email")

    return Response(preference, status=status.HTTP_201_CREATED)

# ------------------------ Webhook para manejar pagos exitosos -------------------------------
@api_view(['POST'])
def payment_webhook(request):
    try:
        payment_data = request.data
        if payment_data['type'] == 'payment':
            payment_id = payment_data['data']['id']
            sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
            payment_info = sdk.payment().get(payment_id)
            if payment_info['status'] == 200:
                preference_id = payment_info['response']['preference_id']
                payment_status = payment_info['response']['status']
                payment = handle_successful_payment(preference_id)
                
                if payment_status == 'approved':
                    payment.status = 'approved'
                elif payment_status == 'pending':
                    payment.status = 'pending'
                elif payment_status == 'rejected':
                    payment.status = 'rejected'
                
                payment.save()
        return JsonResponse({"status": "ok"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# ------------------------ Manejo de pagos exitosos -------------------------------
def handle_successful_payment(preference_id):
    sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
    preference_response = sdk.preference().get(preference_id)
    preference = preference_response.get("response")

    if not preference:
        raise Exception("No se encontró la preferencia en MercadoPago")

    movie_title = preference["metadata"]["movie_title"]
    seats = preference["metadata"]["seats"]
    total_amount = preference["metadata"]["total_amount"]
    ticket_price = preference["metadata"]["ticket_price"]
    user_email = preference["payer"]["email"]

    movie = Movie.objects.get(title=movie_title)
    user = User.objects.get(email=user_email)

    payment = Payment.objects.create(
        user=user,
        movie=movie,
        amount=total_amount,
        status="approved"
    )

    for seat in seats:
        seat_obj = Seat.objects.get(row=seat["row"], number=seat["number"], movie=movie)
        payment.seats.add(seat_obj)

    payment.save()

    return payment

# ------------------------ Endpoint para el éxito de pagos -------------------------------
@csrf_exempt
@require_GET
def payment_success(request):
    preference_id = request.GET.get('preference_id')

    if not preference_id:
        return JsonResponse({"error": "Preference ID is required"}, status=400)

    sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
    preference_response = sdk.preference().get(preference_id)
    preference = preference_response["response"]

    movie_title = preference["metadata"]["movie_title"]
    seats = preference["metadata"]["seats"]
    total_amount = preference["metadata"]["total_amount"]
    ticket_price = preference["metadata"]["ticket_price"]
    hall_name = preference["metadata"]["hall_name"]
    format = preference["metadata"]["format"]
    showtime = preference["metadata"]["showtime"]

    showtime_datetime = datetime.strptime(showtime, '%Y-%m-%dT%H:%M:%S')

    argentina_tz = pytz.timezone('America/Argentina/Buenos_Aires')
    showtime_local = showtime_datetime.astimezone(argentina_tz)

    invoice_data = {
        "movie_title": movie_title,
        "seats": seats,
        "total_amount": total_amount,
        "ticket_price": ticket_price,
        "hall_name": hall_name,
        "format": format,
        "showtime": showtime_local.strftime('%Y-%m-%d %H:%M:%S')
    }

    return JsonResponse(invoice_data)

# ------------------------ Estadísticas de ventas -------------------------------
class SalesStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        sales_data = Payment.objects.filter(status="approved") \
            .annotate(date=TruncDate('created_at')) \
            .values('date') \
            .annotate(
                total_sales=Sum('amount'),
                total_tickets=Count('seats')
            ) \
            .order_by('date')

        labels = [data['date'].strftime('%Y-%m-%d') for data in sales_data]
        total_sales = [data['total_sales'] for data in sales_data]
        total_tickets = [data['total_tickets'] for data in sales_data]

        return Response({
            "labels": labels,
            "total_sales": total_sales,
            "total_tickets": total_tickets
        })