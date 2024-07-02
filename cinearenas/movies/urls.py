# --------- imports ---------
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# -------- Creación de un enrutador que maneja automáticamente las URL para las vistas de conjunto --------
#  -------- definir las URL de una API con el enrutador de DRF --------

router = DefaultRouter()
router.register(r'seats', views.SeatViewSet)  # Registrar el ViewSet de asientos
router.register(r'reservations', views.ReservationViewSet)  # Registrar el ViewSet de reservaciones
router.register(r'movies', views.MovieViewSet, basename='movie')  # registrar el ViewSet de películas con un basename personalizado

# -------- urls --------
urlpatterns = [
    path('login/', views.CustomObtainAuthToken.as_view(), name='login'),  # Ruta para iniciar sesión y obtener un token de autenticación
    path('logout/', views.user_logout, name='user_logout'),  # logout
    path('csrf/', views.get_csrf_token, name='csrf'),  # obtener token csrf
    path('movies/', views.MovieListCreate.as_view(), name='movie-list-create'),  # listar y crear peliculas
    path('movies/<int:pk>/', views.MovieDetail.as_view(), name='movie-detail'),  # CRUD para las películas por ID (seleccionar de a 1, según el entero)
    path('', include(router.urls)),  # Incluir todas las rutas generadas automáticamente por el enrutador
    path('create-payment/', views.create_payment, name='create-payment'),  # crear pago con la API de MP
    path('payment-success/', views.payment_success, name='payment_success'),  # mostrar la factura
]
