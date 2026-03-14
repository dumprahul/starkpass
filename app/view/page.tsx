"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react"
import { dummyEvents } from "@/lib/dummy-events"
import type { Event } from "@/lib/types"

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    })
  } catch {
    return iso
  }
}

function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/view/${event.event_id}`} className="block group">
      <Card className="border-2 border-foreground rounded-none bg-background overflow-hidden transition-all duration-200 group-hover:border-[#ea580c] group-hover:shadow-[4px_4px_0_0_hsl(var(--foreground))]">
      <CardHeader className="border-b-2 border-foreground py-3 px-4 flex flex-row items-center justify-between gap-4">
        <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
          {event.event_id}
        </span>
        {event.active ? (
          <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 bg-[#ea580c] text-white">
            ACTIVE
          </span>
        ) : (
          <span className="text-[9px] font-mono tracking-widest uppercase text-muted-foreground">
            INACTIVE
          </span>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-mono font-bold text-base uppercase tracking-tight mb-3">
          {event.name}
        </h3>
        <div className="flex flex-col gap-2 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin size={12} className="shrink-0" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={12} className="shrink-0" />
            <span>{formatDate(event.start_time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={12} className="shrink-0" />
            <span>
              {event.ticket_count} / {event.max_attendees} attendees
              {event.age_requirement > 0 && ` · ${event.age_requirement}+`}
            </span>
          </div>
        </div>
        <p className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground mt-3">
          Organizer: {event.organizer}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase text-[#ea580c] group-hover:underline">
          View details →
        </span>
      </CardContent>
    </Card>
    </Link>
  )
}

export default function ViewEventsPage() {
  return (
    <div className="min-h-screen dot-grid-bg">
      <Navbar />
      <main className="w-full px-4 py-8 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              {"// VIEW_EVENTS"}
            </span>
            <div className="flex-1 border-t border-border" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="font-mono text-2xl font-bold uppercase tracking-tight">
              All events
            </h1>
            <Link href="/create">
              <Button className="font-mono tracking-widest uppercase rounded-none bg-foreground text-background hover:bg-foreground/90">
                Create event
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dummyEvents.map((event) => (
              <EventCard key={event.event_id} event={event} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
