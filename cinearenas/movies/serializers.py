from rest_framework import serializers
from .models import Movie, Seat, Reservation

class MovieSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = ['id', 'title', 'description', 'release_date', 'image', 'image_url']

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ['id', 'row', 'number', 'is_reserved']

class ReservationSerializer(serializers.ModelSerializer):
    seats = serializers.PrimaryKeyRelatedField(queryset=Seat.objects.all(), many=True)
    
    class Meta:
        model = Reservation
        fields = ['id', 'user', 'seats', 'movie', 'reservation_time']
        extra_kwargs = {
            'user': {'required': False},  # Hacer que el campo user no sea requerido
        }