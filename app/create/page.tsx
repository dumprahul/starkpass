"use client"

import { useState } from "react"
import Link from "next/link"
import { usePrivy } from "@privy-io/react-auth"
import { shortString } from "starknet"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, ExternalLink, Wallet, LogIn, CheckCircle2, AlertCircle } from "lucide-react"
import { useStarkZapWallet } from "@/lib/useStarkZapWallet"
import type { Event } from "@/lib/types"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""

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
  const [submitting, setSubmitting] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { login, authenticated, ready: privyReady } = usePrivy()
  const { wallet, connect, connecting, error: walletError } = useStarkZapWallet()

  const update = (key: keyof typeof form, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wallet) return

    setSubmitting(true)
    setError(null)
    setTxHash(null)

    try {
      const eventNameFelt = shortString.encodeShortString(form.name)

      const call = {
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: "create_event",
        calldata: [
          eventNameFelt,
          form.age_requirement.toString(),
          form.max_attendees.toString(),
        ],
      }

      const tx = await wallet.execute([call], { feeMode: "sponsored" })
      setTxHash(tx.hash || tx.transaction_hash)
      await tx.wait()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Transaction failed"
      setError(message)
    } finally {
      setSubmitting(false)
    }
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

          {/* Wallet connection status */}
          <Card className="border-2 border-foreground rounded-none bg-background mb-6">
            <CardContent className="pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet size={16} className="text-muted-foreground" />
                  <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                    {!privyReady
                      ? "loading..."
                      : !authenticated
                        ? "not_signed_in"
                        : !wallet
                          ? "wallet_not_connected"
                          : `connected: ${wallet.address?.toString().slice(0, 10)}...`}
                  </span>
                </div>
                <div>
                  {!authenticated ? (
                    <Button
                      onClick={login}
                      size="sm"
                      className="font-mono tracking-widest uppercase rounded-none text-xs bg-foreground text-background hover:bg-foreground/90"
                    >
                      <LogIn size={12} className="mr-2" />
                      Sign in
                    </Button>
                  ) : !wallet ? (
                    <Button
                      onClick={connect}
                      disabled={connecting}
                      size="sm"
                      className="font-mono tracking-widest uppercase rounded-none text-xs bg-foreground text-background hover:bg-foreground/90"
                    >
                      {connecting ? (
                        <Loader2 size={12} className="mr-2 animate-spin" />
                      ) : (
                        <Wallet size={12} className="mr-2" />
                      )}
                      {connecting ? "Connecting..." : "Connect wallet"}
                    </Button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
                      ready
                    </span>
                  )}
                </div>
              </div>
              {walletError && (
                <p className="mt-3 text-xs font-mono text-red-600">{walletError}</p>
              )}
            </CardContent>
          </Card>

          {/* Success banner */}
          {txHash && (
            <Card className="border-2 border-green-700 rounded-none bg-green-50 mb-6">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-green-700 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-mono font-bold uppercase tracking-widest text-green-800">
                      Event created on-chain
                    </p>
                    <a
                      href={`https://sepolia.voyager.online/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-xs font-mono text-green-700 hover:text-green-900 underline underline-offset-2 break-all inline-flex items-center gap-1"
                    >
                      View on Voyager <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error banner */}
          {error && (
            <Card className="border-2 border-red-600 rounded-none bg-red-50 mb-6">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-mono font-bold uppercase tracking-widest text-red-800">
                      Transaction failed
                    </p>
                    <p className="mt-1 text-xs font-mono text-red-700 break-all">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                      name
                    </Label>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      on-chain · {31 - form.name.length} chars left
                    </span>
                  </div>
                  <Input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Event name (max 31 chars, stored on-chain)"
                    className="font-mono border-2 border-foreground rounded-none"
                    maxLength={31}
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
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                      age_requirement
                    </Label>
                    <span className="text-[10px] font-mono text-muted-foreground">on-chain</span>
                  </div>
                  <Input
                    type="number"
                    min={0}
                    max={255}
                    value={form.age_requirement}
                    onChange={(e) => update("age_requirement", parseInt(e.target.value, 10) || 0)}
                    className="font-mono border-2 border-foreground rounded-none"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                      max_attendees
                    </Label>
                    <span className="text-[10px] font-mono text-muted-foreground">on-chain</span>
                  </div>
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

                {/* On-chain info note */}
                <div className="border-t border-border pt-4">
                  <p className="text-[10px] font-mono text-muted-foreground tracking-wider">
                    {"// fields marked 'on-chain' are stored on starknet sepolia via gasless tx (avnu paymaster). "}
                    {"organizer is auto-set from your wallet address on-chain."}
                  </p>
                </div>

                <div className="flex gap-4 pt-2">
                  <Button
                    type="submit"
                    disabled={!wallet || submitting || !form.name || !form.max_attendees}
                    className="flex-1 font-mono tracking-widest uppercase rounded-none bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="mr-2 animate-spin" />
                        Creating on-chain...
                      </>
                    ) : !wallet ? (
                      "Connect wallet first"
                    ) : (
                      "Create event"
                    )}
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
