from rest_framework import viewsets, generics, filters, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.exceptions import ValidationError, AuthenticationFailed

from django.contrib.auth import logout
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
import mercadopago
from django.conf import settings
from .models import Movie, Seat, Reservation
from .serializers import MovieSerializer, SeatSerializer, ReservationSerializer 

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
    permission_classes = [AllowAny]  # Permitir acceso sin autenticación


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
def user_logout(request):
    request.user.auth_token.delete()
    logout(request)
    return Response(status=204)


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
    if not email:
        return Response({"error": "Email is required for payment"}, status=status.HTTP_400_BAD_REQUEST)

    preference_data = {
        "items": [
            {
                "title": "Movie Ticket",
                "quantity": len(request.data.get('seats', [])),
                "unit_price": 100.00
            }
        ],
        "payer": {
            "email": email,
        },
        "back_urls": {
            "success": "http://localhost:3000/payment-success",
            "failure": "http://localhost:3000/payment-failure",
            "pending": "http://localhost:3000/payment-pending"
        },
        "auto_return": "approved"
    }

    preference_response = sdk.preference().create(preference_data)
    preference = preference_response["response"]

    return Response(preference, status=status.HTTP_201_CREATED)