"use client"

import Loader from "@rahoot/web/components/Loader"
import { useSocket } from "@rahoot/web/contexts/socketProvider"
import Image from "next/image"
import { PropsWithChildren, useEffect } from "react"

const gradientBg = "linear-gradient(160deg, #0d0520 0%, #1a0a35 50%, #05101a 100%)"

const AuthLayout = ({ children }: PropsWithChildren) => {
  const { isConnected, connect } = useSocket()
  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [connect, isConnected])

  if (!isConnected) {
    return (
      <section
        className="relative flex min-h-dvh flex-col items-center justify-start pt-16"
        style={{ background: gradientBg }}
      >
        <Image src="/logo.png" width={280} height={112} className="mb-8" alt="Preston Palace" />
        <Loader className="h-23" />
        <h2 className="mt-2 text-center text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
          Loading...
        </h2>
      </section>
    )
  }

  return (
    <section
      className="relative flex min-h-dvh flex-col items-center justify-center"
      style={{ background: gradientBg }}
    >
      {children}
    </section>
  )
}

export default AuthLayout
