import { Component, OnInit } from '@angular/core';
import {Building} from "../models/building";
import {DashboardDataService} from "../services/dashboard-data/dashboard-data.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {


  public buildings: any;
  constructor(private dashboardDataService: DashboardDataService) { }

  ngOnInit(): void {
    this.getBuildings()
  }

  getBuildings(): void{
    this.dashboardDataService.getBuildings()
        .subscribe(buildings => this.buildings = buildings.results);
  }

}
