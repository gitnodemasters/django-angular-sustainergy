import json
import os

import pygal
from django.http import HttpResponse
from django.template.defaultfilters import register
from django.template.loader import get_template
from pygal.style import Style
from rest_framework import viewsets
from rest_framework.decorators import action
from weasyprint import HTML

# Create your views here.
from sustainergy_dashboard.models import Building, Panel, Circuit, DailyData
from sustainergy_dashboard.serializers import BuildingSerializer, PanelSerializer, CircuitSerializer, \
    DailyDataSerializer


class BuildingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Building.objects.all().order_by('-city')
    serializer_class = BuildingSerializer
    # permission_classes = [permissions.IsAuthenticated]


class PanelViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Panel.objects.all().order_by('-panel_name')
    serializer_class = PanelSerializer
    # permission_classes = [permissions.IsAuthenticated]


class CircuitViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Circuit.objects.all().order_by('-circuit_name')
    serializer_class = CircuitSerializer

    def get_queryset(self):
        queryset = self.queryset
        query_set = queryset.filter(panel_id=self.request.query_params.get('panel_id'))
        return query_set

    # permission_classes = [permissions.IsAuthenticated]


class DownloadReports(viewsets.ModelViewSet):
    serializer_class = PanelSerializer

    def generate_filename(self, report_type):
        return "2022_08_11_panel_report"

    @action(methods=['get'], detail=False, url_path=r'building/(?P<building_id>[\w-]+)/download', url_name='buildingid')
    def get_panel_report_for_building(self, request, building_id=None):
        current_panel_ids = []
        data = []
        # get Building information
        building_info = Building.objects.get(idbuildings=building_id)
        # get Panels of the building
        panels_of_building = Panel.objects.all().filter(building_id=building_id)
        for panel in panels_of_building:
            if panel.panel_id in current_panel_ids:
                continue
            current_panel_ids.append(panel.panel_id)
            panel_data = {
                "panel_name": panel.panel_name,
                "panel_id": panel.panel_id,
                "panel_voltage": panel.panel_voltage or "None",
                "categories": {},
                "circuits": []
            }
            circuits_of_panel = Circuit.objects.all().filter(panel_id=panel.panel_id)
            for index, circuit in enumerate(circuits_of_panel):
                panel_data["circuits"].append({
                    "circuit_number": index,
                    "circuit_name": circuit.circuit_name,
                    "circuit_category": circuit.circuit_category
                })
                if panel_data["categories"].get(circuit.circuit_category) is not None:
                    panel_data["categories"][circuit.circuit_category] += 1
                else:
                    panel_data["categories"][circuit.circuit_category] = 0

            panel_data["circuits_number"] = len(panel_data["circuits"])
            panel_data["circuits_per_column"] = len(panel_data["circuits"]) // 3
            panel_data["circuits_per_column2"] = (len(panel_data["circuits"]) // 3) * 2

            panel_data["total_categories"] = sum(panel_data["categories"].values())
            panel_data["sorted_categories"] = list(panel_data["categories"].keys())
            panel_data["sorted_categories"].sort()
            if panel_data["total_categories"] != 0:
                panel_data["categories"] = {k: round((v / panel_data["total_categories"]) * 100, 2)
                                            for k, v in panel_data["categories"].items()}
                # Generate Chart
                custom_style = Style(
                    background='transparent',
                    plot_background='transparent',
                    foreground='#FFFFFF',
                    colors=('#3BCDEE', '#3649A8', '#FEC754', '#E87653', '#7F7F7C', '#EE5937', '#EE8F37', '#EC5A38'))
                pie_chart = pygal.Pie(inner_radius=.60, show_legend=False, style=custom_style)
                for panel_category in panel_data["sorted_categories"]:
                    pie_chart.add(panel_category, panel_data["categories"][panel_category])

                chart = pie_chart.render_data_uri()
                panel_data['panel_chart'] = chart
            else:
                panel_data["categories"] = {}
            data.append(panel_data)

        return self.pdf_generation({"data": data,
                                    "building_description": building_info.description,
                                    "building_address": building_info.address })

    def pdf_generation(self, data):
        cwd = os.getcwd()
        html_template = get_template(
            os.path.join(cwd, 'sustainergy_dashboard/templates/generate_panel_report.html')).render(data)
        pdf_file = HTML(string=html_template).write_pdf()
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = 'filename="panel_report.pdf"'
        return response

    def get_queryset(self):
        return Panel.objects.all().order_by('-panel_name')


class OperatingHoursViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    pagination_class = None
    queryset = DailyData.objects.all().order_by('-event_date')
    serializer_class = DailyDataSerializer
    # permission_classes = [permissions.IsAuthenticated]


@register.filter
def get_value_from_dict(h, key):
    return h.get(key)


@register.filter(is_safe=True)
def jsonify(data):
    return json.dumps(data)
