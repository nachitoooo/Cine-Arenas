# movies/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('movies/', views.MovieListCreate.as_view(), name='movie-list-create'),
    path('movies/<int:pk>/', views.MovieDetail.as_view(), name='movie-detail'),
]
