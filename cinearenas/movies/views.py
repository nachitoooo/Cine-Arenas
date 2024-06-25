from django.shortcuts import render
from rest_framework import viewsets

# Create your views here.
from rest_framework import generics
from .models import Movie, Seat, Reservation
from .serializers import MovieSerializer, SeatSerializer, ReservationSerializer

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