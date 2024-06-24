from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Movie
from .serializers import MovieSerializer

class MovieListCreate(generics.ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

class MovieDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer