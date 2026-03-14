import { StarkZap } from "starkzap"

export const sdk = new StarkZap({
  network: "sepolia",
  paymaster: {
    nodeUrl: "/api/paymaster",
  },
})
