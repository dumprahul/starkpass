import { NextRequest, NextResponse } from "next/server"
import { PrivyClient } from "@privy-io/node"

const privy = new PrivyClient({
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  appSecret: process.env.PRIVY_APP_SECRET!,
})

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Missing authorization token" }, { status: 401 })
    }

    await privy.utils().auth().verifyAuthToken(token)

    const wallet = await privy.wallets().create({
      chain_type: "starknet",
    })

    const origin = req.nextUrl.origin

    return NextResponse.json({
      walletId: wallet.id,
      publicKey: wallet.public_key,
      serverUrl: `${origin}/api/wallet/sign`,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("Signer context error:", message)
    return NextResponse.json(
      { error: "Failed to create signer context", details: message },
      { status: 500 }
    )
  }
}
