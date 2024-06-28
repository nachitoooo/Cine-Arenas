from django.db import models
from django.contrib.auth.models import User

class Movie(models.Model):
    title = models.CharField(max_length=125)
    description = models.TextField()
    release_date = models.DateField()
    image = models.ImageField(upload_to='movies/', null=True, blank=True)

    def __str__(self):
        return self.title

class Seat(models.Model):
    row = models.CharField(max_length=1)
    number = models.PositiveIntegerField()
    is_reserved = models.BooleanField(default=False)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='seats')

    def __str__(self):
        return f"{self.row}{self.number}"

class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    seats = models.ManyToManyField(Seat)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    reservation_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reservation for {self.user} at {self.reservation_time}"
