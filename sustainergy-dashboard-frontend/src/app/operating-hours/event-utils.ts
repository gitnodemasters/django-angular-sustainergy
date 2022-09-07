import { EventInput } from '@fullcalendar/angular';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: '8:30 am - 6:30 pm',
    start: TODAY_STR,
    description: "10 hours"
  },
  {
    id: createEventId(),
    title: 'Closed',
    start: "2022-08-07"
  }
];

export function createEventId() {
  return String(eventGuid++);
}
