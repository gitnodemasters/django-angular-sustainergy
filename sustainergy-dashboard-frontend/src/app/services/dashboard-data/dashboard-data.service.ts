import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  constructor(private http: HttpClient) { }
  baseURL = "https://api.opti-mized.com/"; 
  buildingsUrl = 'buildings/';
  panelsUrl = 'panels/';
  circuitsUrl = 'circuits/';
  panelScheduleReport = 'panel_report/building/';
  operatinghourUrl = 'operatingHours/';

  getBuildings() : Observable<any>{
    console.log(this.baseURL);
    return this.http.get<any>(this.baseURL + this.buildingsUrl);
  }
  getPanels(buildingId: any) : Observable<any>{
    return this.http.get<any>(this.baseURL + this.panelsUrl,
       {params:
         {
      building_id: buildingId
         }

      } );
  }
  getCircuits(panelId: any) : Observable<any>{
    return this.http.get<any>(this.baseURL + this.circuitsUrl, {params:{panel_id: panelId}

      });
  }
  getOperatingHours() : Observable<any>{
    return this.http.get<any>(this.baseURL + this.operatinghourUrl);
  }

  addEvents(params:any): Observable<any>{
    return this.http.post<any>(this.baseURL + this.operatinghourUrl , params);
  }
  updateEvents(id:any,params:any): Observable<any>{
    // const body = { start_time: start_time || '',end_time:end_time || '',event_date:date|| '' };
    return this.http.put<any>(this.baseURL + this.operatinghourUrl + id+"/", params);
  }

  removeEvent(id:any): Observable<any>{
    return this.http.delete<any>(this.baseURL + this.operatinghourUrl + id+"/");
  }



  downloadPanelScheduleReport(buildingId:any){

    let url = this.baseURL + this.panelScheduleReport + buildingId + "/" + "download/"
    window.open(url, "_blank");
    //return this.http.get(url, { responseType: 'blob' });

  }
}
