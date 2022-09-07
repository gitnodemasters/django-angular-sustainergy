# Generated by Django 4.0.6 on 2022-08-01 00:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Building',
            fields=[
                ('building_id', models.CharField(default='mfzY2Mpy', max_length=30, primary_key=True, serialize=False)),
                ('client_id', models.CharField(max_length=30)),
                ('address', models.CharField(max_length=30)),
                ('city', models.CharField(max_length=30)),
                ('description', models.CharField(max_length=30)),
                ('occupants', models.CharField(max_length=30)),
                ('occupies_days_per_week', models.CharField(max_length=30)),
                ('length_of_occupied_day', models.CharField(max_length=30)),
                ('start_hour', models.CharField(max_length=30)),
                ('end_hour', models.CharField(max_length=30)),
                ('number_of_doors', models.CharField(max_length=30)),
                ('square_footage', models.CharField(max_length=30)),
                ('exterior_wall_square_footage', models.CharField(max_length=30)),
                ('window_square_footage', models.CharField(max_length=30)),
                ('roof_square_footage', models.CharField(max_length=30)),
                ('price_per_gj', models.CharField(max_length=30)),
                ('price_per_kwh', models.CharField(max_length=30)),
                ('vist_duration', models.CharField(max_length=30)),
                ('calculated', models.BooleanField(default=False)),
            ],
            options={
                'db_table': 'buildings',
            },
        ),
        migrations.CreateModel(
            name='Panel',
            fields=[
                ('panel_name', models.CharField(max_length=30)),
                ('panel_id', models.CharField(default='Hwh4YxLQ', max_length=30, primary_key=True, serialize=False)),
                ('panel_type', models.CharField(max_length=30)),
                ('panel_voltage', models.CharField(max_length=30)),
                ('panel_image', models.CharField(max_length=50)),
                ('building_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sustainergy_dashboard.building')),
            ],
            options={
                'db_table': 'panel_data',
            },
        ),
        migrations.CreateModel(
            name='Circuit',
            fields=[
                ('circuit_id', models.CharField(default='Msxosm24', max_length=30, primary_key=True, serialize=False)),
                ('circuit_name', models.CharField(max_length=30)),
                ('circuit_category', models.CharField(max_length=30)),
                ('circuit_amps', models.CharField(max_length=30)),
                ('panel_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sustainergy_dashboard.panel')),
            ],
            options={
                'db_table': 'circuit_data',
            },
        ),
    ]
