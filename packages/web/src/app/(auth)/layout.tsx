"use client"

import Loader from "@rahoot/web/components/Loader"
import { useSocket } from "@rahoot/web/contexts/socketProvider"
import Image from "next/image"
import { PropsWithChildren, useEffect } from "react"

const AuthLayout = ({ children }: PropsWithChildren) => {
  const { isConnected, connect } = useSocket()
  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [connect, isConnected])

  if (!isConnected) {
    return (
      <section className="relative flex min-h-dvh flex-col items-center justify-start pt-16">
        <video
          className="pointer-events-none fixed top-0 left-0 -z-10 h-full w-full object-cover"
          src="/background.mov"
          autoPlay
          loop
          muted
          playsInline
        />
        <Image src="/logo.png" width={320} height={128} className="mb-8" alt="Preston Palace" />
        <Loader className="h-23" />
        <h2 className="mt-2 text-center text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
          Loading...
        </h2>
      </section>
    )
  }

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center">
      <video
        className="pointer-events-none fixed top-0 left-0 -z-10 h-full w-full object-cover"
        src="/background.mov"
        autoPlay
        loop
        muted
        playsInline
      />
      <Image src="/logo.png" width={320} height={128} className="mb-8" alt="Preston Palace" />
      {children}
    </section>
  )
}

export default AuthLayout
