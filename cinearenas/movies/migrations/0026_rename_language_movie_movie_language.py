# Generated by Django 4.2.6 on 2024-08-09 23:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0025_alter_movie_duration_alter_movie_language'),
    ]

    operations = [
        migrations.RenameField(
            model_name='movie',
            old_name='language',
            new_name='movie_language',
        ),
    ]
