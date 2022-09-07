from django.contrib.auth.models import User, Group
from rest_framework import serializers

from sustainergy_dashboard.models import Building, Panel, Circuit, DailyData


class BuildingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Building
        fields = ['idbuildings', 'client_id', 'address', 'city', 'description',
                  'occupants', 'occupies_days_per_week',
                  'length_of_occupied_day',
                  'start_hour', 'end_hour', 'number_of_doors', 'squarefootage',
                  'exterior_wall_squarefootage', 'window_squarfootage', 'roof_squarefootage',
                  'price_per_gj', 'price_per_kwh', 'vist_duration', 'calculated']


class PanelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Panel
        fields = ['panel_name', 'building_id', 'panel_id', 'panel_type', 'panel_voltage', 'panel_image']


class CircuitSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Circuit
        fields = ['id', 'circuit_name', 'circuit_category', 'circuit_amps', 'panel_id']


class DailyDataSerializer(serializers.ModelSerializer):
    start_time = serializers.TimeField(required=False, input_formats=None)
    end_time = serializers.TimeField(required=False, input_formats=None)
    days_of_week = serializers.ListField(
        child=serializers.CharField(max_length=200)
    )

    class Meta:
        model = DailyData
        fields = ['id', 'event_date', 'start_time', 'end_time', 'is_closed', 'is_repeat', "days_of_week", "is_daily",
                  "is_weekly"]
        optional_fields = ['days_of_week', 'is_closed', 'is_repeat', 'start_time', 'end_time']
