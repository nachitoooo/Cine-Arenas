# Generated by Django 4.2.6 on 2024-08-09 23:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0027_alter_movie_movie_language'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='movie',
            name='movie_language',
        ),
    ]