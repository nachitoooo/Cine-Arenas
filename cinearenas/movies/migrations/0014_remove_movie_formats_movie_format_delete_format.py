# Generated by Django 4.2.6 on 2024-08-02 00:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0013_format_remove_movie_format_movie_formats'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='movie',
            name='formats',
        ),
        migrations.AddField(
            model_name='movie',
            name='format',
            field=models.CharField(choices=[('2D', '2D'), ('3D', '3D')], default=None, max_length=2),
        ),
        migrations.DeleteModel(
            name='Format',
        ),
    ]
