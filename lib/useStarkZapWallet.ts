"use client"

import { useState, useCallback } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { OnboardStrategy, accountPresets } from "starkzap"
import { sdk } from "./starkzap"

export function useStarkZapWallet() {
  const { getAccessToken, authenticated, ready } = usePrivy()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [wallet, setWallet] = useState<any>(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async () => {
    setConnecting(true)
    setError(null)
    try {
      const accessToken = await getAccessToken()
      const { wallet: w } = await sdk.onboard({
        strategy: OnboardStrategy.Privy,
        privy: {
          resolve: async () => {
            const res = await fetch("/api/signer-context", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            })
            if (!res.ok) throw new Error("Failed to get signer context")
            return res.json()
          },
        },
        accountPreset: accountPresets.argentXV050,
        feeMode: "sponsored",
        deploy: "never",
      })
      setWallet(w)
      return w
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect wallet"
      setError(message)
      throw err
    } finally {
      setConnecting(false)
    }
  }, [getAccessToken])

  return { wallet, connect, connecting, error, authenticated, ready }
}
