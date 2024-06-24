from rest_framework import serializers
from .models import Movie

class MovieSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = ['id', 'title', 'description', 'release_date', 'image']

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None
