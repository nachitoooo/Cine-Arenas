from django.db import models

# Create your models here.
class Movie(models.Model):
    title = models.CharField(max_length=125)
    description = models.TextField()
    release_date = models.DateField()
    image = models.ImageField(upload_to='movies/', null=True, blank=True)

    def __str__(self):
        return self.title