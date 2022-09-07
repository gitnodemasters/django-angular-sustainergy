import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { BrowserModule ,HammerModule} from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LiveUsageComponent } from './live-usage/live-usage.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InventoryDataStreamComponent } from './inventory-data-stream/inventory-data-stream.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AboutFacilityComponent } from './about-facility/about-facility.component';
import { OperatingHoursComponent } from './operating-hours/operating-hours.component';
import {NgApexchartsModule} from "ng-apexcharts";
import {HttpClientModule} from "@angular/common/http";
import { FullCalendarModule } from '@fullcalendar/angular';
import rrulePlugin from '@fullcalendar/rrule'
import dayGridPlugin from '@fullcalendar/daygrid';
import { IgxTimePickerModule,
	IgxInputGroupModule,
	IgxIconModule
 } from "igniteui-angular";
import {DatePipe} from '@angular/common';
import { FormsModule } from '@angular/forms';
import interactionPlugin from '@fullcalendar/interaction';
import {AlertReportsComponent} from "./alert-reports/alert-reports.component";

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  rrulePlugin,
  interactionPlugin
])

@NgModule({
  declarations: [
    AppComponent,
    LiveUsageComponent,
    InventoryDataStreamComponent,
    SidebarComponent,
    AboutFacilityComponent,
    OperatingHoursComponent,
    AlertReportsComponent
  ],
  imports: [
    BrowserModule,
    FullCalendarModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    HammerModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: '', pathMatch: 'full', redirectTo: 'home'},
      {path: 'home', component: LiveUsageComponent},
      {path: 'inventory', component: InventoryDataStreamComponent},
      {path: 'alertreports', component: AlertReportsComponent},
      {path: 'about', component: AboutFacilityComponent},
      {path: 'operatinghours', component: OperatingHoursComponent}

    ]),
    NgApexchartsModule,
    IgxTimePickerModule,
    IgxInputGroupModule,
    IgxIconModule,
    FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class AppModule { }
