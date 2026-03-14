"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import type { Event } from "@/lib/types"

const defaultEvent: Omit<Event, "event_id"> & { event_id: string } = {
  event_id: "",
  organizer: "",
  name: "",
  location: "",
  start_time: "",
  age_requirement: 18,
  max_attendees: 100,
  ticket_count: 0,
  active: true,
}

export default function CreateEventPage() {
  const [form, setForm] = useState(defaultEvent)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: send to backend
    console.log("Create event:", form)
  }

  const update = (key: keyof typeof form, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen dot-grid-bg">
      <Navbar />
      <main className="w-full px-4 py-8 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              {"// CREATE_EVENT"}
            </span>
            <div className="flex-1 border-t border-border" />
          </div>

          <Card className="border-2 border-foreground rounded-none bg-background">
            <CardHeader className="border-b-2 border-foreground">
              <CardTitle className="text-lg font-mono tracking-tight uppercase">
                New event
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                    event_id
                  </Label>
                  <Input
                    value={form.event_id}
                    onChange={(e) => update("event_id", e.target.value)}
                    placeholder="e.g. evt_001 or leave empty to generate"
                    className="font-mono border-2 border-foreground rounded-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                    organizer
                  </Label>
                  <Input
                    value={form.organizer}
                    onChange={(e) => update("organizer", e.target.value)}
                    placeholder="Organizer name or address"
                    className="font-mono border-2 border-foreground rounded-none"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                    name
                  </Label>
                  <Input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Event name"
                    className="font-mono border-2 border-foreground rounded-none"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                    location
                  </Label>
                  <Input
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    placeholder="Venue or address"
                    className="font-mono border-2 border-foreground rounded-none"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                    start_time
                  </Label>
                  <Input
                    type="datetime-local"
                    value={form.start_time}
                    onChange={(e) => update("start_time", e.target.value)}
                    className="font-mono border-2 border-foreground rounded-none"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                    age_requirement
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.age_requirement}
                    onChange={(e) => update("age_requirement", parseInt(e.target.value, 10) || 0)}
                    className="font-mono border-2 border-foreground rounded-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                    max_attendees
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.max_attendees}
                    onChange={(e) => update("max_attendees", parseInt(e.target.value, 10) || 0)}
                    className="font-mono border-2 border-foreground rounded-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                    ticket_count
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.ticket_count}
                    onChange={(e) => update("ticket_count", parseInt(e.target.value, 10) || 0)}
                    className="font-mono border-2 border-foreground rounded-none"
                  />
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border">
                  <Label className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                    active
                  </Label>
                  <Switch
                    checked={form.active}
                    onCheckedChange={(v) => update("active", v)}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 font-mono tracking-widest uppercase rounded-none bg-foreground text-background hover:bg-foreground/90"
                  >
                    Create event
                  </Button>
                  <Link href="/view">
                    <Button
                      type="button"
                      variant="outline"
                      className="font-mono tracking-widest uppercase rounded-none border-2 border-foreground"
                    >
                      View events
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
