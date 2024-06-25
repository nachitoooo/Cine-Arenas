from django.shortcuts import render
from rest_framework import viewsets

# Create your views here.
from rest_framework import generics
from .models import Movie, Seat, Reservation
from .serializers import MovieSerializer, SeatSerializer, ReservationSerializer
import mercadopago
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


class MovieListCreate(generics.ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

class MovieDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer


class SeatViewSet(viewsets.ModelViewSet):
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def perform_create(self, serializer):
        seats = self.request.data.get('seats')
        reservation = serializer.save(user=self.request.user)
        for seat_id in seats:
            seat = Seat.objects.get(id=seat_id)
            seat.is_reserved = True
            seat.save()
            reservation.seats.add(seat)
        reservation.save()    


#mercadopago



@api_view(['POST'])
def create_payment(request):
    sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

    preference_data = {
        "items": [
            {
                "title": "Movie Ticket",
                "quantity": 1,
                "unit_price": 100.00
            }
        ],
        "payer": {
            "email": request.user.email,
        },
        "back_urls": {
            "success": "http://localhost:3000/success",
            "failure": "http://localhost:3000/failure",
            "pending": "http://localhost:3000/pending"
        },
        "auto_return": "approved"
    }

    preference_response = sdk.preference().create(preference_data)
    preference = preference_response["response"]

    return Response(preference, status=status.HTTP_201_CREATED)
