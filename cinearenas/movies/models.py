from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.contrib.auth.models import User

class Movie(models.Model):
    FORMAT_CHOICES = [
        ('2D', '2D'),
        ('3D', '3D'),
    ]

    title = models.CharField(max_length=125)
    description = models.TextField()
    release_date = models.DateField()
    image = models.ImageField(upload_to='movies/', null=True, blank=True)
    cinema_listing = models.ImageField(upload_to='movies/cinema_listing/', null=True, blank=False)
    hall_name = models.CharField(max_length=100, default=None)  # nombre de la sala
    format = models.CharField(max_length=2, choices=FORMAT_CHOICES, default=None)  
    duration = models.CharField(max_length=250, default="N/A", blank=False)
    movie_language = models.CharField(max_length=50, default="Espanol")  

    
    def __str__(self):
        return self.title



class Showtime(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='showtimes')
    showtime = models.DateTimeField()  # Fecha y hora de la función

    def __str__(self):
        return f"{self.movie.title} at {self.showtime}"


class Seat(models.Model):
    row = models.CharField(max_length=1)
    number = models.PositiveIntegerField()
    is_reserved = models.BooleanField(default=False)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='seats')

    def __str__(self):
        return f"{self.row}{self.number}"

class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    seats = models.ManyToManyField(Seat)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    reservation_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reservation for {self.user} at {self.reservation_time}"
    
class Payment(models.Model):
    STATUS_CHOICES = [
        ('approved', 'Approved'),
        ('pending', 'Pending'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    seats = models.ManyToManyField(Seat)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Payment of {self.amount} for {self.movie.title} ({self.status})"    