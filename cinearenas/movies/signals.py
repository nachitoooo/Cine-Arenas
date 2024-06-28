from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Movie, Seat

@receiver(post_save, sender=Movie)
def create_seats(sender, instance, created, **kwargs):
    if created:
        rows = 'ABCDEFGHIJ'  
        seat_number = 5  
        for row in rows:
            for number in range(1, seat_number + 1):
                Seat.objects.create(row=row, number=number, movie=instance)
