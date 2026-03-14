export interface Event {
  event_id: string
  organizer: string
  name: string
  location: string
  start_time: string // ISO or display string
  age_requirement: number
  max_attendees: number
  ticket_count: number
  active: boolean
}
