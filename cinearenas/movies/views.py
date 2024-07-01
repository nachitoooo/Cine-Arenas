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
from .models import Movie, Seat, Reservation
from .serializers import MovieSerializer, SeatSerializer, ReservationSerializer 
from django.shortcuts import render
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt
class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]

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

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        seats = self.request.data.get('seats')
        if not seats:
            raise ValidationError('No seats selected')
        
        # Asignar el usuario solo si está autenticado, de lo contrario dejarlo nulo
        user = self.request.user if self.request.user.is_authenticated else None
        reservation = serializer.save(user=user)
        
        for seat_id in seats:
            seat = Seat.objects.get(id=seat_id)
            seat.is_reserved = True
            seat.save()
            reservation.seats.add(seat)
        reservation.save()

class MovieListCreate(generics.ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]  # Permitir acceso sin autenticación

class MovieDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [AllowAny] 

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'csrfToken': request.META.get('CSRF_COOKIE', '')})

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
    

@api_view(['GET'])
@permission_classes([AllowAny])
def public_movie_list(request):
    movies = Movie.objects.all()
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)


#mercadopago
@api_view(['POST'])
@permission_classes([AllowAny])
def create_payment(request):
    sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
    
    email = request.data.get('email')
    seats = request.data.get('seats', [])
    if not email or not seats:
        return Response({"error": "Email and seats are required for payment"}, status=status.HTTP_400_BAD_REQUEST)

    # Obtener información de los asientos y la película
    seat_objects = Seat.objects.filter(id__in=seats)
    movie_id = seat_objects.first().movie_id if seat_objects.exists() else None
    movie = Movie.objects.get(id=movie_id) if movie_id else None

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

    preference_response = sdk.preference().create(preference_data)
    preference = preference_response["response"]

    # Guardar la preferencia en la base de datos (si es necesario)

    return Response(preference, status=status.HTTP_201_CREATED)


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

    invoice_data = {
        "movie_title": movie_title,
        "seats": seats,
        "total_amount": total_amount,
    }

    return JsonResponse(invoice_data)
