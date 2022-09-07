import { Component, OnInit } from '@angular/core';
import {DashboardDataService} from "../services/dashboard-data/dashboard-data.service";
@Component({
  selector: 'app-alert-reports',
  templateUrl: './alert-reports.component.html',
  styleUrls: ['./alert-reports.component.scss']
})
export class AlertReportsComponent implements OnInit {

  constructor(private dashboardDataService: DashboardDataService) { }

  ngOnInit(): void {
  }
  
  isShow = true;
 
  toggleDisplay() {
    this.isShow = !this.isShow;
  }
  
  displayStyle = "none";
  
  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }


 isShowDivIf = false;  
    
  toggleDisplayDivIf() {  
    this.isShowDivIf = !this.isShowDivIf;  
  }  
  
  
  toggleDisplay2() {  
     this.isShow = !this.isShow;
  }

  downloadPanelScheduleReport(){
      this.dashboardDataService.downloadPanelScheduleReport("2cbf7a65");

  }




  
}
