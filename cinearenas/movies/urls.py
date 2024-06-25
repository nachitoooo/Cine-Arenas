# movies/urls.py

from django.urls import path, include
from . import views
from .views import SeatViewSet, ReservationViewSet, create_payment
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'seats', SeatViewSet)
router.register(r'reservations', ReservationViewSet)

urlpatterns = [
    path('movies/', views.MovieListCreate.as_view(), name='movie-list-create'),
    path('movies/<int:pk>/', views.MovieDetail.as_view(), name='movie-detail'),
    path('', include(router.urls)),
    path('create-payment/', create_payment, name='create-payment'),
]
