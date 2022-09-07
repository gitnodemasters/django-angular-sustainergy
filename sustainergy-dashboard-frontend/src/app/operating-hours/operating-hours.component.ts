import {DashboardDataService} from "../services/dashboard-data/dashboard-data.service";
import {OperatingHours} from "../models/operating_hours";
import { Component,ElementRef,ViewChild  } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import {DatePipe} from '@angular/common';
import { PickerInteractionMode } from 'igniteui-angular';
import { EventInput } from '@fullcalendar/angular';

@Component({
  selector: 'app-operating-hours',
  templateUrl: './operating-hours.component.html',
  styleUrls: ['./operating-hours.component.scss']
})
export class OperatingHoursComponent  {

  constructor(private dashboardDataService: DashboardDataService, public datepipe: DatePipe) {
  }
  ngOnInit(): void {
    // console.log(this.triggerFalseClick());
    this.getOperatingHours();
    
    //set current building
  }
  public mode: PickerInteractionMode = PickerInteractionMode.DropDown;
  public format = 'hh:mm tt';

isShow = true;
selectedDate:any;
weekday:any;
showMsg: boolean = false;
msg: string = "";
isChecked: boolean = false;
isRepeatChecked: boolean = false;
timepickerVisible = false;
time1= "09:00:00";
time2= "18:00:00";
days_of_week:any = []
weekDays = ['SU','MO', 'TU','WE','TH','FR','SA']
is_daily:boolean = false
is_weekly:boolean = false
meridian = true;
repeatList: string[] = [];
popupData:any;
public setDateToPopup : any;
 
  toggleDisplay() {
    this.isShow = !this.isShow;
  }
  
  displayStyle = "none";
  
  
  openPopup() {
    this.weekday = this.datepipe.transform(this.selectedDate, 'EEEE');
    var annualDay = this.datepipe.transform(this.selectedDate, 'MMMM dd');
    this.repeatList = ["Daily", "Weekly on "+ this.weekday, "Every weekday (Monday to Friday)"]
    this.popupData = this.operatinghours.find(x => x.event_date === this.selectedDate);
    if (this.popupData){
      this.getPopUpData();
    }
    
    this.displayStyle = "block";
  
  }

  
  closePopup() {
    this.displayStyle = "none";
    window.location.reload();
  }


   calendarVisible = true;
   operatinghours: any[]= [];
   Events: any[] = [];
   replacedEvents: any[] = [];
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: '',
      center: '',
      right: 'prev title next'
    },
    initialView: 'dayGridMonth',
    events: INITIAL_EVENTS,  // alternatively, use the `events` setting to fetch from a feed
    // businessHours: [], // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    showNonCurrentDates: false,
    editable: true,
    displayEventTime: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    // eventContent: INITIAL_EVENTS,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    // eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
	contentHeight: "auto",
	//aspectRatio: 2,
	fixedWeekCount: false,
  };
  currentEvents: EventApi[] = [];

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }
  startTimechange(evt:any){
    // if (this.time2 === undefined){
    //   var endTime = new Date(this.time1);
    //   this.time2 = endTime.setHours(endTime.getHours() + 3);
    // }
    this.popupData = this.operatinghours.find(x => x.event_date === this.selectedDate);
    if (this.popupData === undefined){
        this.isRepeatChecked = false
        this.onAddEvent(this.time1,this.time2,this.selectedDate,this.isRepeatChecked,this.isChecked,this.days_of_week,this.is_daily,this.is_weekly);
    }
    else{
        if(this.popupData.is_weekly === true){
          this.is_weekly = this.popupData.is_weekly
        }
        if(this.popupData.is_daily === true){
          this.is_daily = this.popupData.is_daily
        }
        if (this.popupData.days_of_week.length === 7){
          this.days_of_week = 0
        }else if(this.popupData.days_of_week.length === 1){
          this.days_of_week = 1
        }else if(this.popupData.days_of_week.length === 5){
          this.days_of_week = 2
        }
        this.updateEvent(this.time1,this.time2,this.selectedDate,this.popupData.id,this.isRepeatChecked,this.isChecked,this.popupData.days_of_week,this.is_daily,this.is_weekly);
    }
  }
  endTimechange(){
    // if (this.time1 === undefined){
    //   var startTime = new Date(this.time2);
    //   this.time1 = startTime.setHours(startTime.getHours() - 3);
    // }
    this.popupData = this.operatinghours.find(x => x.event_date === this.selectedDate);
    if (this.popupData !== undefined){
      if(this.popupData.is_weekly === true){
        this.is_weekly = this.popupData.is_weekly
      }
      if(this.popupData.is_daily === true){
        this.is_daily = this.popupData.is_daily
      }
      if (this.popupData.days_of_week.length === 7){
        this.days_of_week = 0
      }else if(this.popupData.days_of_week.length === 1){
        this.days_of_week = 1
      }else if(this.popupData.days_of_week.length === 5){
        this.days_of_week = 2
      }
      this.updateEvent(this.time1,this.time2,this.selectedDate,this.popupData.id,this.isRepeatChecked,this.isChecked,this.days_of_week,this.is_daily,this.is_weekly);
    }else{
        this.isRepeatChecked = false
        this.onAddEvent(this.time1,this.time2,this.selectedDate,this.isRepeatChecked,this.isChecked,this.days_of_week,this.is_daily,this.is_weekly);
    }

  }
  handleDateSelect(selectInfo: DateSelectArg) {
    this.setDateToPopup = this.datepipe.transform(selectInfo.startStr, 'EEEE, MMMM d, y');
    this.selectedDate = selectInfo.startStr
    this.openPopup();
  }

  handleEventClick(clickInfo: EventClickArg) {
    // console.log(clickInfo.event.startStr)
    
    // this.openPopup();
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      this.removeEvent(clickInfo.event.startStr);
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;

  }
  
  removeEvent(startDate:any):void{
    const operatingHours = this.operatinghours.find(x => x.event_date === startDate);
    this.dashboardDataService.removeEvent(operatingHours.id)
      .subscribe((status)=>{
        this.replacedEvents = []
        this.Events = []
        this.getOperatingHours();
      })
  }

  changed(evt:any) {
    this.isChecked = evt.target.checked;
    this.popupData = this.operatinghours.find(x => x.event_date === this.selectedDate);
    if (this.popupData === undefined && this.isChecked){
      this.onAddEvent(this.time1,this.time2,this.selectedDate,this.isRepeatChecked,this.isChecked,this.days_of_week,this.is_daily,this.is_weekly);
      this.timeoutSleep()
    }else if(!this.isChecked){
      this.removeEvent(this.selectedDate);
      this.timeoutSleep()
    }
    else{
      this.updateEvent(this.time1,this.time2,this.selectedDate,this.popupData.id,this.isRepeatChecked,this.isChecked,this.days_of_week,this.is_daily,this.is_weekly);
      console.log(this.Events);
      this.timeoutSleep()
    }
    

  }

  repeatChanged(evt:any) {
    
    this.isRepeatChecked = evt.target.checked;
    // this.isChecked = false;
    this.popupData = this.operatinghours.find(x => x.event_date === this.selectedDate);
    if(!this.isRepeatChecked){

      this.time1 = this.popupData.start_time
      this.time2 = this.popupData.end_time
      var startTimeTokens = this.popupData.start_time.split(':');
      var endTimeTokens = this.popupData.end_time.split(':');
      var start_time = new Date(1970,0,1, startTimeTokens[0], startTimeTokens[1], startTimeTokens[2]);
      var end_time = new Date(1970,0,1, endTimeTokens[0], endTimeTokens[1], endTimeTokens[2]);
      var StartTime = this.datepipe.transform(start_time, 'hh:mm a');
      var EndTime = this.datepipe.transform(end_time, 'hh:mm a');
      this.days_of_week = []
      this.is_daily = false
      this.is_weekly = false
      this.updateEvent(this.time1,this.time2,this.selectedDate,this.popupData.id,this.isRepeatChecked,this.isChecked,this.days_of_week,this.is_daily,this.is_weekly);
      this.timeoutSleep()
    }else{
      if(this.popupData !== undefined)this.isRepeatChecked = evt.target.value;
    }
    
      
  }

  areEqual(array1:any, array2:any) {
    if (array1.length === array2.length) {
      return array1.every((element:any, index:any) => {
        if (element === array2[index]) {
          return true;
        }
  
        return false;
      });
    }
  
    return false;
  }
  selectRepeatOption(evt:any){
    this.popupData = this.operatinghours.find(x => x.event_date === this.selectedDate);
    if (this.popupData !== undefined){
      this.time1 = this.popupData.start_time
      this.time2 = this.popupData.end_time
      this.days_of_week = evt
      
      this.updateEvent(this.time1,this.time2,this.selectedDate,this.popupData.id,this.isRepeatChecked,this.isChecked,this.days_of_week,this.is_daily,this.is_weekly);
      this.timeoutSleep()
    }

  }
  timeoutSleep(){
    setTimeout(() => {
      console.log('sleep');
      this.closePopup();
    }, 3000);
  }
  updateEvent(startTime:any,endTime:any,start_date:any,id:any,is_repeat:boolean,is_closed:boolean,days_of_week:any ,is_daily:boolean,is_weekly:boolean):void{
    // startTime = this.datepipe.transform(startTime, 'hh:mm:ss');
    // endTime = this.datepipe.transform(endTime, 'hh:mm:ss');
    var d= new Date(this.selectedDate+" "+this.time1);
    // console.log(d);
    var dayName = this.weekDays[d.getDay()];
    if (days_of_week===0){
      days_of_week = ['Su','MO', 'TU','WE','TH','FR','SA']
      is_daily =true
      is_weekly =false
      // window.location.reload();
    }
    else if(days_of_week===1){
      days_of_week = [dayName]
      is_weekly = true
      is_daily =false
      // window.location.reload();
    }
    else if(days_of_week===2){
      is_weekly = true
      is_daily =false
      days_of_week = ['MO', 'TU','WE','TH','FR']
      // window.location.reload();
    }
    var params = { }
    if (startTime  === "" || startTime === undefined  && endTime === "" || endTime === undefined || is_closed===true){
      params =  {start_time: "00:00:00",end_time:"00:00:00",is_closed:is_closed,is_repeat:is_repeat,days_of_week:days_of_week,event_date:start_date,is_daily:is_daily,is_weekly:is_weekly}
    }else{
      params =  { start_time: startTime,end_time:endTime,event_date:start_date,is_closed:is_closed,is_repeat:is_repeat,days_of_week:days_of_week,is_daily:is_daily,is_weekly:is_weekly}
    }
    this.dashboardDataService.updateEvents(id , params)
      .subscribe((events)=>{
        // console.log(events);
        this.showMsg= true;
        this.msg = "Event updated Successfully."
        setTimeout(()=>{                      
          this.showMsg = false;
          this.msg = ""
      }, 1000);
        this.replacedEvents = []
        this.Events= []
        this.getOperatingHours();
      })
  }
 async onAddEvent(startTime:any,endTime:any,start_date:any,is_repeat:boolean,is_closed:boolean,days_of_week:any,is_daily:boolean,is_weekly:boolean){
    // startTime = this.datepipe.transform(startTime, 'hh:mm:ss');
    // endTime = this.datepipe.transform(endTime, 'hh:mm:ss');
    
    var params = { }
    if (startTime  === "" || startTime === undefined  && endTime === "" || endTime === undefined || is_closed===true){
      params =  {start_time: "00:00:00",end_time:"00:00:00",is_closed:is_closed,is_repeat:is_repeat,days_of_week:days_of_week,event_date:start_date,is_daily:is_daily,is_weekly:is_weekly}
    }else{
      params =  { start_time: startTime,end_time:endTime,event_date:start_date,is_closed:is_closed,is_repeat:is_repeat,days_of_week:days_of_week,is_daily:is_daily,is_weekly:is_weekly}
    }
    this.dashboardDataService.addEvents(params)
      .subscribe((events)=>{
        this.showMsg= true;
        this.msg = "Event Added Successfully."
        setTimeout(()=>{                      
          this.showMsg = false;
          this.msg = ""
      }, 1000);
          this.replacedEvents= []
          this.Events= []
          this.getOperatingHours();
        })
    }
    getPopUpData(){
      this.weekday = this.datepipe.transform(this.selectedDate, 'EEEE');
      var annualDay = this.datepipe.transform(this.selectedDate, 'MMMM dd');
      this.repeatList = ["Daily", "Weekly on "+ this.weekday, "Every weekday (Monday to Friday)"]
      // "Monthy on the fourth "+ this.weekday,"Monthy on the last "+ this.weekday,"Annualy on "+ annualDay,
      if (this.popupData.start_time && this.popupData.end_time){
        this.time1 = this.popupData.start_time
        this.time2 = this.popupData.end_time
        var startTimeTokens = this.popupData.start_time.split(':');
        var endTimeTokens = this.popupData.end_time.split(':');
        var start_time = new Date(1970,0,1, startTimeTokens[0], startTimeTokens[1], startTimeTokens[2]);
        var end_time = new Date(1970,0,1, endTimeTokens[0], endTimeTokens[1], endTimeTokens[2]);
        var StartTime = this.datepipe.transform(start_time, 'hh:mm a');
        var EndTime = this.datepipe.transform(end_time, 'hh:mm a');
      }
      this.isChecked = this.popupData.is_closed;
      this.isRepeatChecked = this.popupData.is_repeat;
      this.days_of_week = this.popupData.days_of_week
      
      if (this.days_of_week !== undefined && this.days_of_week.length === 7){
        this.days_of_week = 0
      }
      else if(this.days_of_week !== undefined && this.days_of_week.length === 1){
        this.days_of_week = 1
      }
    else if(this.days_of_week !== undefined && this.days_of_week.length === 5){
      this.days_of_week = 2
    }
    var d= new Date(this.selectedDate);
  }
  
  getDaysInMonth(year:any, month:any) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    // console.log(days);
    return days;
  }

  getDates(startDate:any, stopDate:any) {
    var oneDay = 24*3600*1000;
    for (var d=[],ms=startDate*1,last=stopDate*1;ms<last;ms+=oneDay){
      d.push( new Date(ms) );
    }
  return d;
}

  getOperatingHours(){
    this.dashboardDataService.getOperatingHours()
        .subscribe((operatinghours) => {
            this.operatinghours = operatinghours;
            var exdate =[]
            var dates:any =[]
            var frequency = ""
            var byweekday:any
            var obj={}
            var lastDay:any
            var repeatClosedDate:any
            // if(repeatClosedDate){exdate.push(repeatClosedDate)}
            for(let i=0; i<this.operatinghours.length; i++){
              var startDate = new Date(this.operatinghours[i].event_date + ' ' + this.operatinghours[i].start_time)
              lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
              if (this.operatinghours[i].start_time  && this.operatinghours[i].end_time){
                  // var startTimeTokens = this.operatinghours[i].start_time.split(':');
                  // var endTimeTokens = this.operatinghours[i].end_time.split(':');
                  var start_time = new Date(this.operatinghours[i].event_date + ' ' + this.operatinghours[i].start_time);
                  var end_time = new Date(this.operatinghours[i].event_date + ' ' + this.operatinghours[i].end_time);
                  var Time = end_time.getHours() - start_time.getHours();
                  var StartTime = this.datepipe.transform(start_time, 'h:mm a');
                  var EndTime = this.datepipe.transform(end_time, 'h:mm a');
                   
                  var condition1 =  (this.operatinghours[i].days_of_week !== undefined || this.operatinghours[i].days_of_week !== null || this.operatinghours[i].days_of_week.length !== 0 )
                  var condition2 =  (this.operatinghours[i].days_of_week === undefined || this.operatinghours[i].days_of_week === null || this.operatinghours[i].days_of_week.length === 0 )
                  // console.log(this.operatinghours[i])
                  if (this.operatinghours[i].is_repeat === false && this.operatinghours[i].start_time && this.operatinghours[i].end_time && this.operatinghours[i].is_closed === false && condition2){
                      obj = { title: StartTime?.toLowerCase()+" - "+ EndTime?.toLowerCase() ,date: this.operatinghours[i].event_date,description: Time+" hours",className:"eventPresent"
                      }
                      exdate.push(this.operatinghours[i].event_date)
                  }
                  if (this.operatinghours[i].is_repeat === false && this.operatinghours[i].is_closed === true && condition2){
                      obj = { title: "Closed",date: this.operatinghours[i].event_date,className:"closedEvent"}
                      exdate.push(this.operatinghours[i].event_date)
                  }
                  
                  if (this.operatinghours[i].is_repeat === true && condition1){
                     if (this.operatinghours[i].is_daily === true && this.operatinghours[i].is_weekly===false){
                        frequency = "daily"
                        byweekday =  this.operatinghours[i].days_of_week
                     }else if (this.operatinghours[i].is_daily === false && this.operatinghours[i].is_weekly===true){
                        frequency = "weekly",
                        byweekday =  this.operatinghours[i].days_of_week
                        // dates.push(this.operatinghours[i].event_date)
                     }
                      
                      if(this.operatinghours[i].is_closed === true){
                        obj = { title: "Closed" ,date: this.operatinghours[i].event_date,className:"recurringClosedEvent",
                                rrule: {
                                    freq: frequency,
                                    byweekday: byweekday,
                                    dtstart: this.operatinghours[i].event_date,
                                    until: this.datepipe.transform(lastDay, 'yyyy-MM-dd')
                              },
                              exdate: exdate,
                              
                        }
                      }else if(this.operatinghours[i].is_closed === false){
                        obj = { 
                          title: StartTime?.toLowerCase()+" - "+ EndTime?.toLowerCase(),
                          interval: 1,
                          description: Time +" hours",
                          className:"recurringEventPresent",
                          // allDay: false,
                          // duration: "10:00:00",
                            rrule: {
                              freq: frequency,
                              byweekday: byweekday,
                              dtstart: this.operatinghours[i].event_date,
                              until: this.datepipe.transform(lastDay, 'yyyy-MM-dd')
                            },
                            exdate: exdate
                        }
                      }
                  }
                
              this.Events.push(obj)
            }

          }
        var obj1 ={}
        var j = 0
        var k = 0
        var weekdays:any =[]
        this.Events.map((event:any)=>{
          
          if(event.className==="recurringEventPresent" || event.className==="recurringClosedEvent"){
            // if (event.rrule.byweekday.length === 1){
            //    weekdays.push(event.rrule.byweekday[0])
            // }
            if (j === 0){
              // if (event.rrule.byweekday.length === 1){
              //   obj1=event
              // }
              // else if(event.rrule.byweekday.length === 7 ){
              //   obj1 = { title: event.title ,date: event.rrule.dtstart,description: event.description,className:"closedEventPresent"
              // }
              //   // console.log(event);
              // }else{
               obj1 = event
              // }
              j++
            }else if(event.className==="recurringClosedEvent"){
              obj1 = { title: event.title ,date: event.rrule.dtstart,description: event.description,className:"closedEventPresent"
                        }
            }
            else{
              obj1 = { title: event.title ,date: event.rrule.dtstart,description: event.description,className:"eventPresent"
              }
                // obj1 = obj1
            }
            // if (event.className==="recurringClosedEvent"){
            //   if (j === 0){
            //     // console.log(event.)
            //     // if (event.rrule.byweekday.length === 5){
            //     //   obj1=event
            //     // }else if(event.rrule.byweekday.length === 7 ){
            //     //   obj1 = { title: event.title ,date: event.rrule.dtstart,description: event.description,className:"closedEventPresent"
            //     // }
            //     //   // console.log(event);
            //     // }else{
            //       obj1 = event
            //     // }
            //     j++
            //   }
            //   else{
            //       obj1 = { title: event.title ,date: event.rrule.dtstart,description: event.description,className:"closedEventPresent"
            //               }
            //       // obj1 = obj1
            //       }
            // }else if(event.className==="recurringEventPresent"){
            //   if (k === 0){
            //     // if(event.rrule.byweekday.length === 7){
            //     //   console.log(event)
            //     // }
            //     obj1 = event
            //     k++
            //   }
            //   else{
            //     obj1 = { title: event.title ,date: event.rrule.dtstart,description: event.description,className:"eventPresent"
            //             }
            //     }
            // }
            
          }
          else{
            obj1 = event 
          }
          this.replacedEvents.push(obj1)
        })
        // console.log(this.replacedEvents)

        this.calendarOptions.events = this.replacedEvents;
        this.calendarOptions.eventContent = function (arg) {
          // console.log(document.body)
          var event = arg.event;
          var customHtml = '';
          let newNode = document.createElement('div');
          let closedNode = document.createElement('div');
          let newNode1 = document.createElement('div');
          let arrayOfDomNodes:any = []
          if (event.extendedProps["description"] !== undefined){
            var title:any = event.title.trim().split("-")
            const [start_time, modifier] = title[0].trim().split(" ");
            const [end_time, end_modifier] = title[1].trim().split(" ");
            let [start_hours,start_minutes] = start_time.split(":");
            let [end_hours,end_minutes] = end_time.split(":");
            // console.log(start_hours,end_hours)
            newNode.className = 'timeTitle';
            newNode1.className = 'eventDescription';
            newNode.innerHTML = "<div class='startTimetext'><span class='hoursText'>" + start_hours + "</span><span class='minutes'>:"+ start_minutes +"</span><span class='modifiers'>"+modifier+"</span> </div><span class='dividerText'>-</span><div class='endTimetext'><span class='hoursText'>" + end_hours + "</span><span class='minutes'>:"+ end_minutes +"</span><span class='modifiers'>"+end_modifier+"</span></div>"
            newNode1.innerHTML = "<span class='durationText'>" + event.extendedProps["description"] + "</span>"
            arrayOfDomNodes = [ newNode ,newNode1]
          }else {

            if(event.title==="Closed"){
              closedNode.className = 'closedText';
              closedNode.innerHTML = "<span class='closedtext'>"+event.title+"</span>"
            }
            arrayOfDomNodes = [closedNode]
          }            
          
          return { domNodes: arrayOfDomNodes }  

        }

        });

  }
}
