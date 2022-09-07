import {Component, OnInit, ViewChild} from '@angular/core';
import {DashboardDataService} from "../services/dashboard-data/dashboard-data.service";
import {Building} from "../models/building";
import {Panel} from "../models/panel";
import {Circuit} from "../models/circuit";
import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexTitleSubtitle,
    ApexDataLabels,
    ApexFill,
    ApexYAxis,
    ApexXAxis,
    ApexTooltip,
    ApexMarkers,
    ApexAnnotations,
    ApexStroke, ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    dataLabels: ApexDataLabels;
    markers: ApexMarkers;
    title: ApexTitleSubtitle;
    fill: ApexFill;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    annotations: ApexAnnotations;
    colors: any;
    toolbar: any;
};

@Component({
  selector: 'app-live-usage',
  templateUrl: './live-usage.component.html',
  styleUrls: ['./live-usage.component.scss']
})

export class LiveUsageComponent implements OnInit {
    @ViewChild('chart', {static: true}) chart: ChartComponent;
    public chartOptions: Partial<ChartOptions> | any;


    constructor(private dashboardDataService: DashboardDataService) {
        this.chartOptions = {
            series: [19, 21, 43, 11, 6],
            dataLabels: { // add this part to remove %
                enabled: false,
            },
            legend: {
                show: false,
            },
            chart: {
                type: "donut",
                width: '320px'
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                label: '',
                                formatter: () => 'Text you want'
                            }
                        }
                    }
                }
            },
            colors: ['#3BCDEE', '#EE5937', '#3649A8', '#EE8F37', '#FEC754'],
            labels: ["Pumps/Motors", "HVAC", "Lighting", "Plug Load", "DHW"],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 10
                        },
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ]
        };
    }



    buildings: Building[]= [

    ];
    panels: Panel[]= [
        {
            panel_name : "Panel 1",
            building_id: "Building 1",
            panel_id: "panel 1",
            panel_type: "panel type 1",
            panel_voltage: "panel voltage 1",
            panel_image: "panel image 1",
            panel_circuits: []
        },
        {
            panel_name : "Panel 2",
            building_id: "Building 2",
            panel_id: "panel 2",
            panel_type: "panel type 2",
            panel_voltage: "panel voltage 2",
            panel_image: "panel image 2",
            panel_circuits: []

        },
        {
            panel_name : "Panel 3",
            building_id: "Building 3",
            panel_id: "panel 3",
            panel_type: "panel type 3",
            panel_voltage: "panel voltage 3",
            panel_image: "panel image 3",
            panel_circuits: []
        },
        {
            panel_name : "Panel 4",
            building_id: "Building 4",
            panel_id: "panel 4",
            panel_type: "panel type 4",
            panel_voltage: "panel voltage 4",
            panel_image: "panel image 4",
            panel_circuits: []
        }, {
            panel_name : "Panel 5",
            building_id: "Building 5",
            panel_id: "panel 5",
            panel_type: "panel type 5",
            panel_voltage: "panel voltage 5",
            panel_image: "panel image 5",
            panel_circuits: []
        },

    ];
    circuits: Circuit[]= [];

 active = 2;
 public isCostSelected = false;
 public isCollapsed: boolean[] = [];
 public panelsIsConnected = false
    public currentSelectedBuilding: Building =  new Building("", "", "")


  ngOnInit(): void {
      this.getBuildings()
      //set current building

      this.getPanels(this.currentSelectedBuilding.idbuildings)
      //this.getCircuits()
  }

    getBuildings(): void{
        this.dashboardDataService.getBuildings()
            .subscribe((buildings) => {
                console.log(buildings)
                this.buildings = buildings.results
                this.currentSelectedBuilding = this.buildings[0]

            });

    }

    getPanels(buildingId: any): void{
        this.dashboardDataService.getPanels(this.currentSelectedBuilding.idbuildings)
            .subscribe((panels: any) => {
                this.panels = panels.results
                this.getCircuits()

            });
    }

    getCircuits(): void{
        for (let i = 0; i < this.panels.length; i++) {
            this.isCollapsed.push(false)
            this.dashboardDataService.getCircuits(this.panels[i].panel_id)
                .subscribe((circuits: any) => this.panels[i].panel_circuits = circuits.results);
        }

    }

    toggleDropdown(index: number): void{
     this.isCollapsed[index] = !this.isCollapsed[index]
    }

}
