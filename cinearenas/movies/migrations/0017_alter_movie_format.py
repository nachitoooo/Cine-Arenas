# Generated by Django 4.2.6 on 2024-08-02 00:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0016_alter_movie_format'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='format',
            field=models.CharField(blank=True, choices=[('2D', '2D'), ('3D', '3D')], max_length=2, null=True),
        ),
    ]
