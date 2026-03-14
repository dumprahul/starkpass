 "use client"

import TransgateConnect from "@zkpass/transgate-js-sdk"

export const verify = async () => {
  try {
    const appid = "e9779656-3ba1-4f32-b9c9-ee4747e37f20"
    const schemaId = "28a65e5b5a194646864003398bda87d8"

    console.log("starting zkconnect")
    const connector = new TransgateConnect(appid)

    const res = await connector.launch(schemaId)
    console.log("response proofs:", res)
    return res
  } catch (error) {
    console.log("transgate error", error)
    return null
  }
}

