# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'seats', views.SeatViewSet)
router.register(r'reservations', views.ReservationViewSet)
router.register(r'movies', views.MovieViewSet, basename='movie')

urlpatterns = [
    path('login/', views.CustomObtainAuthToken.as_view(), name='login'),
    path('logout/', views.user_logout, name='user_logout'),  # Asegúrate de que esta ruta esté correctamente definida
    path('csrf/', views.get_csrf_token, name='csrf'),
    path('movies/', views.MovieListCreate.as_view(), name='movie-list-create'),
    path('movies/<int:pk>/', views.MovieDetail.as_view(), name='movie-detail'),
    path('', include(router.urls)),
    path('create-payment/', views.create_payment, name='create-payment'),
]
