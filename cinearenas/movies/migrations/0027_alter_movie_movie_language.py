# Generated by Django 4.2.6 on 2024-08-09 23:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0026_rename_language_movie_movie_language'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='movie_language',
            field=models.CharField(default='Espanol', max_length=50),
        ),
    ]
