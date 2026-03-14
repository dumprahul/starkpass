"use client"

import { PrivyProvider } from "@privy-io/react-auth"

export function StarkPassPrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email"],
        appearance: {
          theme: "light",
          accentColor: "#0A0A0A",
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
