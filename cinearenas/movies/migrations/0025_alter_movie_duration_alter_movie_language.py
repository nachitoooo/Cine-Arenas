# Generated by Django 4.2.6 on 2024-08-09 23:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0024_alter_movie_duration_alter_movie_language'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='duration',
            field=models.CharField(default='N/A', max_length=250),
        ),
        migrations.AlterField(
            model_name='movie',
            name='language',
            field=models.CharField(default='Español', max_length=50),
        ),
    ]