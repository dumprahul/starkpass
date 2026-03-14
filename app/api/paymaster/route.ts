import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const response = await fetch("https://sepolia.paymaster.avnu.fi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.AVNU_PAYMASTER_API_KEY && {
          "x-paymaster-api-key": process.env.AVNU_PAYMASTER_API_KEY,
        }),
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (err) {
    console.error("Paymaster proxy error:", err)
    return NextResponse.json(
      { error: "Paymaster request failed" },
      { status: 500 }
    )
  }
}
