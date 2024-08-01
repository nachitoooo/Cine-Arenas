# Importaciones necesarias desde el framework Django REST y otros módulos relevantes
from rest_framework import viewsets, generics, filters, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import logout
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
import mercadopago
from django.conf import settings
from .models import Movie, Seat, Reservation, Showtime
from .serializers import MovieSerializer, SeatSerializer, ReservationSerializer, ShowtimeSerializer
from django.shortcuts import render
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt

# ------------------------ ViewSet para manejar las operaciones CRUD en el modelo Movie ------------------------
class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()  # Consulta para obtener todas las películas
    serializer_class = MovieSerializer  # Serializador para el modelo Movie
    permission_classes = [IsAuthenticated]  # Requiere autenticación para acceder a estas vistas

class ShowtimeViewSet(viewsets.ModelViewSet):
    queryset = Showtime.objects.all()
    serializer_class = ShowtimeSerializer
    permission_classes = [IsAuthenticated]

# ViewSet para manejar las operaciones CRUD en el modelo Seat
class SeatViewSet(viewsets.ModelViewSet):
    queryset = Seat.objects.all()  # Consulta para obtener todos los asientos
    serializer_class = SeatSerializer  # Serializador para el modelo Seat
    filter_backends = [filters.SearchFilter]  # Permite buscar a través de filtros
    search_fields = ['movie__id']  # Campo de búsqueda para filtrar por id de película
    permission_classes = [AllowAny]  # Permite acceso sin autenticación

    # Método para filtrar asientos por id de película si se proporciona
    def get_queryset(self):
        movie_id = self.request.query_params.get('movie_id', None)
        if movie_id is not None:
            return Seat.objects.filter(movie_id=movie_id)
        return super().get_queryset()

# ------------------------ ViewSet para manejar las operaciones CRUD en el modelo Reservation ------------------------
class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()  # Obtener las reservas
    serializer_class = ReservationSerializer  # Serializador para el modelo Reservation (json)
    permission_classes = [AllowAny]  #  acceso sin autenticación

    # Método para crear una nueva reservación y marcar los asientos como reservados
    def perform_create(self, serializer):
        seats = self.request.data.get('seats')
        if not seats:
            raise ValidationError('No seats selected')  # Error si no se seleccionan asientos
        
        user = self.request.user if self.request.user.is_authenticated else None
        reservation = serializer.save(user=user)
        
        # Marcar cada asiento seleccionado como reservado
        for seat_id in seats:
            seat = Seat.objects.get(id=seat_id)
            seat.is_reserved = True
            seat.save()
            reservation.seats.add(seat)
        reservation.save()

#  ------------------------ Crear película ------------------------
class MovieListCreate(generics.ListCreateAPIView):
    queryset = Movie.objects.all()  # Consulta para obtener todas las películas
    serializer_class = MovieSerializer  # Convertir a json la clase de models.py
    permission_classes = [AllowAny]  # acceder sin autenticación requerida

# ------------------------ Obtener, actualizar, eliminar y editar una película ------------------------
class MovieDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()  # Consulta para obtener todas las películas
    serializer_class = MovieSerializer  # Serializador para el modelo Movie
    permission_classes = [AllowAny]  # Permite acceso sin autenticación

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


# ------------------------ Logout -------------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def user_logout(request):
    try:
        request.user.auth_token.delete()  # Eliminar el token de autenticación del usuario
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)
    except AttributeError:
        return Response({'error': 'El usuario no tiene un token de autenticación'}, status=status.HTTP_400_BAD_REQUEST)

# Vista pública para listar todas las películas sin necesidad de autenticación
@api_view(['GET'])
@permission_classes([AllowAny])
def public_movie_list(request):
    movies = Movie.objects.all()  # Consulta para obtener todas las películas
    serializer = MovieSerializer(movies, many=True)  # Serializar todas las películas
    return Response(serializer.data)

# Vista para crear un pago utilizando la API de MercadoPago
@api_view(['POST'])
@permission_classes([AllowAny])
def create_payment(request):
    sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)  # Inicializar SDK de MercadoPago
    
    email = request.data.get('email')
    seats = request.data.get('seats', [])
    if not email or not seats:
        return Response({"error": "Email and seats are required for payment"}, status=status.HTTP_400_BAD_REQUEST)

    # Obtener información de los asientos y la película
    seat_objects = Seat.objects.filter(id__in=seats)
    movie_id = seat_objects.first().movie_id if seat_objects.exists() else None
    movie = Movie.objects.get(id=movie_id) if movie_id else None

    # Crear preferencia de pago con los detalles de la compra
    preference_data = {
        "items": [
            {
                "title": f"Movie Ticket for {movie.title}",
                "quantity": len(seats),
                "unit_price": 100.00
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
            "total_amount": 100.00 * len(seats)
        }
    }

    preference_response = sdk.preference().create(preference_data)  # Crear preferencia en MercadoPago
    preference = preference_response["response"]

    # Devolver la preferencia creada en la respuesta
    return Response(preference, status=status.HTTP_201_CREATED)

# Vista para manejar el éxito del pago y devolver los datos de la factura
@csrf_exempt
@require_GET
def payment_success(request):
    preference_id = request.GET.get('preference_id')
    
    if not preference_id:
        return JsonResponse({"error": "Preference ID is required"}, status=400)

    sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
    preference_response = sdk.preference().get(preference_id)
    preference = preference_response["response"]

    # Extraer los datos de la preferencia
    movie_title = preference["metadata"]["movie_title"]
    seats = preference["metadata"]["seats"]
    total_amount = preference["metadata"]["total_amount"]

    # Crear datos de la factura
    invoice_data = {
        "movie_title": movie_title,
        "seats": seats,
        "total_amount": total_amount,
    }

    # Devolver los datos de la factura en una respuesta JSON
    return JsonResponse(invoice_data)