# Generated by Django 4.0.6 on 2022-08-01 01:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sustainergy_dashboard', '0003_building_created_building_modified_circuit_created_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='building',
            name='building_id',
            field=models.CharField(default='MG2FYyeW', max_length=30, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='circuit',
            name='circuit_id',
            field=models.CharField(default='eZbSyrqs', max_length=30, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='client',
            name='client_id',
            field=models.CharField(default='Ywm5HYuw', max_length=30, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='panel',
            name='panel_id',
            field=models.CharField(default='aexKiNZY', max_length=30, primary_key=True, serialize=False),
        ),
    ]
