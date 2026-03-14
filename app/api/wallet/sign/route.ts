import { NextRequest, NextResponse } from "next/server"
import { PrivyClient } from "@privy-io/node"

const privy = new PrivyClient({
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  appSecret: process.env.PRIVY_APP_SECRET!,
})

export async function POST(req: NextRequest) {
  try {
    const { walletId, hash } = await req.json()

    if (!walletId || !hash) {
      return NextResponse.json(
        { error: "Missing walletId or hash" },
        { status: 400 }
      )
    }

    const result = await privy.wallets().rawSign(walletId, {
      params: { hash },
    })

    return NextResponse.json({ signature: result.signature })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("Wallet sign error:", message)
    return NextResponse.json(
      { error: "Failed to sign transaction", details: message },
      { status: 500 }
    )
  }
}
