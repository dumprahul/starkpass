"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  User,
  Ticket,
  Shield,
} from "lucide-react"
import { getEventById } from "@/lib/dummy-events"
import { motion } from "framer-motion"
import { verify } from "@/lib/zkpass"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return {
      full: d.toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: "short",
      }),
      short: d.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    }
  } catch {
    return { full: iso, short: iso }
  }
}

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const event = getEventById(eventId)
  const [verifying, setVerifying] = useState(false)
  const [hasPass, setHasPass] = useState(false)
  const [passModalOpen, setPassModalOpen] = useState(false)

  if (!event) {
    return (
      <div className="min-h-screen dot-grid-bg">
        <Navbar />
        <main className="w-full px-4 py-16 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-muted-foreground mb-4">
              Event not found.
            </p>
            <Link href="/view">
              <Button
                variant="outline"
                className="font-mono tracking-widest uppercase rounded-none border-2 border-foreground"
              >
                Back to events
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const { full: dateFull, short: dateShort } = formatDate(event.start_time)
  const capacityPercent =
    event.max_attendees > 0
      ? Math.round((event.ticket_count / event.max_attendees) * 100)
      : 0

  return (
    <div className="min-h-screen dot-grid-bg">
      <Navbar />
      <main className="w-full px-4 py-8 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/view"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            All events
          </Link>

          {/* Hero block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="border-2 border-foreground bg-background mb-8 overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b-2 border-foreground bg-foreground/5">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                {event.event_id}
              </span>
              <div className="flex items-center gap-3">
                {event.active ? (
                  <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 bg-[#ea580c] text-white">
                    ACTIVE
                  </span>
                ) : (
                  <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
                    INACTIVE
                  </span>
                )}
                {event.age_requirement > 0 && (
                  <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border-2 border-foreground">
                    {event.age_requirement}+ ONLY
                  </span>
                )}
              </div>
            </div>
            <div className="px-6 py-10 lg:py-14">
              <h1 className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-foreground leading-tight">
                {event.name}
              </h1>
              <p className="mt-4 text-sm font-mono text-muted-foreground max-w-xl">
                {event.organizer}
              </p>
            </div>
          </motion.div>

          {/* Details grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8"
          >
            <div className="border-2 border-foreground bg-background p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 border-2 border-foreground">
                  <MapPin size={18} />
                </div>
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                  Location
                </span>
              </div>
              <p className="font-mono text-lg font-medium tracking-tight">
                {event.location}
              </p>
            </div>

            <div className="border-2 border-foreground bg-background p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 border-2 border-foreground">
                  <Calendar size={18} />
                </div>
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                  Date & time
                </span>
              </div>
              <p className="font-mono text-lg font-medium tracking-tight">
                {dateFull}
              </p>
              <p className="text-xs font-mono text-muted-foreground mt-1">
                {dateShort}
              </p>
            </div>

            <div className="border-2 border-foreground bg-background p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 border-2 border-foreground">
                  <User size={18} />
                </div>
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                  Organizer
                </span>
              </div>
              <p className="font-mono text-lg font-medium tracking-tight">
                {event.organizer}
              </p>
            </div>

            <div className="border-2 border-foreground bg-background p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 border-2 border-foreground">
                  <Shield size={18} />
                </div>
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                  Age requirement
                </span>
              </div>
              <p className="font-mono text-lg font-medium tracking-tight">
                {event.age_requirement > 0
                  ? `${event.age_requirement}+ only`
                  : "All ages"}
              </p>
            </div>
          </motion.div>

          {/* Capacity block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="border-2 border-foreground bg-background p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 border-2 border-foreground">
                <Users size={18} />
              </div>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                Capacity
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-mono text-2xl font-bold tracking-tight">
                  {event.ticket_count}
                  <span className="text-muted-foreground font-normal text-base">
                    {" "}
                    / {event.max_attendees} attendees
                  </span>
                </p>
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  {event.max_attendees - event.ticket_count} spots left
                </p>
              </div>
              <div className="w-full sm:w-48 h-3 border-2 border-foreground bg-muted/30">
                <div
                  className="h-full bg-[#ea580c] transition-all duration-500"
                  style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Eligibility (StarkZap-only) */}
          {event.organizer === "StarkZap" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="border-2 border-foreground bg-background p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                  Eligibility check
                </span>
                <p className="text-xs font-mono text-muted-foreground max-w-md">
                  Before you can claim a pass, prove eligibility with a privacy-preserving check powered by StarkPass.
                </p>
              </div>
              <Button
                type="button"
                onClick={async () => {
                  if (verifying) return
                  setVerifying(true)
                  try {
                    const res = await verify()
                    if (res) {
                      toast({
                        title: "Eligibility verified",
                        description: "You successfully proved you follow Starknet on X.",
                      })
                    } else {
                      toast({
                        title: "Verification failed",
                        description: "We couldn't verify your eligibility. Please try again.",
                      })
                    }
                  } finally {
                    setVerifying(false)
                  }
                }}
                disabled={verifying}
                className="font-mono tracking-widest uppercase rounded-none h-11 bg-foreground text-background hover:bg-foreground/90 whitespace-nowrap disabled:opacity-60"
              >
                {verifying ? "Proving..." : "Prove that you followed Starknet on X"}
              </Button>
            </motion.div>
          )
          }

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            {event.active && event.ticket_count < event.max_attendees && (
              <Button
                type="button"
                onClick={() => {
                  if (hasPass) {
                    setPassModalOpen(true)
                    return
                  }
                  setHasPass(true)
                  setPassModalOpen(true)
                  toast({
                    title: "Pass issued",
                    description: "Your StarkPass ticket has been generated for this event.",
                  })
                }}
                disabled={false}
                className="flex-1 font-mono tracking-widest uppercase rounded-none h-12 bg-foreground text-background hover:bg-foreground/90"
              >
                <Ticket size={16} className="mr-2" />
                {hasPass ? "View your pass" : "Get your pass"}
              </Button>
            )}
            <Link href="/view" className="flex-1 sm:flex-initial">
              <Button
                variant="outline"
                className="w-full font-mono tracking-widest uppercase rounded-none h-12 border-2 border-foreground"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to events
              </Button>
            </Link>
          </motion.div>

          {/* Pass modal (popup) */}
          <Dialog open={passModalOpen} onOpenChange={setPassModalOpen}>
            <DialogContent
              className="max-w-md p-0 gap-0 border-2 border-foreground rounded-none bg-transparent shadow-[8px_8px_0_0_hsl(var(--foreground))]"
              aria-describedby={undefined}
            >
              <DialogTitle className="sr-only">
                Your StarkPass ticket — {event.name}
              </DialogTitle>
              <div className="relative w-full border-2 border-foreground bg-background overflow-hidden">
                {/* Top strip */}
                <div className="flex items-center justify-between px-5 py-3 border-b-2 border-foreground bg-foreground text-background">
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase">
                    StarkPass Ticket
                  </span>
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase">
                    {event.event_id}
                  </span>
                </div>

                {/* Main ticket body */}
                <div className="grid grid-cols-[1fr_auto]">
                  <div className="p-5 flex flex-col gap-4 border-r-2 border-dashed border-foreground min-w-0">
                    <div>
                      <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                        Event
                      </p>
                      <p className="font-mono text-base sm:text-lg font-bold uppercase tracking-tight mt-0.5">
                        {event.name}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-xs font-mono">
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                          Location
                        </p>
                        <p className="mt-1">{event.location}</p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                          Date & time
                        </p>
                        <p className="mt-1">{dateShort}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase mt-2 pt-2 border-t border-border">
                      <span className="tracking-[0.2em] text-muted-foreground">
                        Holder
                      </span>
                      <span className="tracking-[0.2em] text-[#ea580c]">
                        zk-verified
                      </span>
                    </div>
                  </div>

                  {/* Right: QR */}
                  <div className="p-5 flex flex-col items-center justify-center bg-muted/20">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 border-2 border-foreground flex items-center justify-center bg-background">
                      <div className="w-[85%] h-[85%] bg-[repeating-linear-gradient(0deg,_transparent_0,_transparent_2px,_hsl(var(--foreground))_2px,_hsl(var(--foreground))_3px),repeating-linear-gradient(90deg,_transparent_0,_transparent_2px,_hsl(var(--foreground))_2px,_hsl(var(--foreground))_3px)]" />
                    </div>
                    <p className="mt-3 text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground text-center">
                      Scan at gate
                    </p>
                  </div>
                </div>

                {/* Bottom strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-t-2 border-foreground bg-foreground/5">
                  <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                    Non-transferable · This event only
                  </span>
                  <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                    StarkPass · Starknet
                  </span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  )
}
