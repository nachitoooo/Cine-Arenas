from django.core.management.base import BaseCommand
from movies.models import Movie

class Command(BaseCommand):
    help = 'Set default format for movies with NULL format'

    def handle(self, *args, **kwargs):
        movies_with_null_format = Movie.objects.filter(format__isnull=True)
        for movie in movies_with_null_format:
            movie.format = '2D'  # O el valor por defecto que desees
            movie.save()
        self.stdout.write(self.style.SUCCESS('Successfully set default format for movies with NULL format'))
