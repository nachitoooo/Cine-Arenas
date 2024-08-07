from rest_framework import serializers
from .models import Movie, Seat, Reservation, Showtime
import pytz
from django.utils import timezone
import datetime
class ShowtimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Showtime
        fields = ['id', 'showtime']

    def to_representation(self, instance):
        argentina_tz = pytz.timezone('America/Argentina/Buenos_Aires')
        showtime_local = instance.showtime.astimezone(argentina_tz)
        ret = super().to_representation(instance)
        ret['showtime'] = showtime_local.strftime('%Y-%m-%dT%H:%M:%S')
        return ret

    def to_internal_value(self, data):
        argentina_tz = pytz.timezone('America/Argentina/Buenos_Aires')
        showtime = datetime.strptime(data['showtime'], '%Y-%m-%dT%H:%M:%S')
        showtime = argentina_tz.localize(showtime)
        data['showtime'] = showtime
        return super().to_internal_value(data)

class MovieSerializer(serializers.ModelSerializer):
    showtime_1 = serializers.DateTimeField(write_only=True, required=False)
    showtime_2 = serializers.DateTimeField(write_only=True, required=False)
    showtime_3 = serializers.DateTimeField(write_only=True, required=False)
    showtimes = ShowtimeSerializer(many=True, read_only=True)
    cinema_listing = serializers.ImageField(required=False)  # Añade este campo


    class Meta:
        model = Movie
        fields = '__all__'

    def create(self, validated_data):
        showtimes_data = []
        for i in range(1, 4):  # Asumiendo que tenemos hasta 3 showtimes
            showtime_key = f'showtime_{i}'
            if showtime_key in validated_data:
                showtimes_data.append({'showtime': validated_data.pop(showtime_key)})

        movie = Movie.objects.create(**validated_data)
        for showtime_data in showtimes_data:
            Showtime.objects.create(movie=movie, **showtime_data)
        return movie

    def update(self, instance, validated_data):
        showtimes_data = []
        for i in range(1, 4):  # Asumiendo que tenemos hasta 3 showtimes
            showtime_key = f'showtime_{i}'
            if showtime_key in validated_data:
                showtimes_data.append({'showtime': validated_data.pop(showtime_key)})

        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.release_date = validated_data.get('release_date', instance.release_date)
        instance.image = validated_data.get('image', instance.image)
        instance.cinema_listing = validated_data.get('cinema_listing', instance.cinema_listing)
        instance.hall_name = validated_data.get('hall_name', instance.hall_name)
        instance.format = validated_data.get('format', instance.format)
        instance.save()

        instance.showtimes.all().delete()
        for showtime_data in showtimes_data:
            Showtime.objects.create(movie=instance, **showtime_data)
        
        return instance

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
            'user': {'required': False},
        }
