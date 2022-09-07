from django.contrib import admin

# Register your models here.
from sustainergy_dashboard.models import Building, Panel, Circuit

admin.site.register(Building)
admin.site.register(Panel)
admin.site.register(Circuit)