# Generated by Django 4.2.6 on 2024-07-24 18:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0005_alter_reservation_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='cinema_listing',
            field=models.ImageField(default=1, upload_to='movies/cinema_listing/'),
            preserve_default=False,
        ),
    ]