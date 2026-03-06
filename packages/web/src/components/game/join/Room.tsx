"use client"

import PinInput from "@rahoot/web/components/PinInput"
import VinylRecord from "@rahoot/web/components/VinylRecord"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const Room = () => {
  const { socket, isConnected } = useSocket()
  const { join } = usePlayerStore()
  const [pin, setPin] = useState("")
  const searchParams = useSearchParams()
  const hasJoinedRef = useRef(false)

  const handleJoin = () => {
    socket?.emit("player:join", pin)
  }

  useEvent("game:successRoom", (gameId) => {
    join(gameId)
  })

  useEffect(() => {
    const pinCode = searchParams.get("pin")

    if (!isConnected || !pinCode || hasJoinedRef.current) {
      return
    }

    socket?.emit("player:join", pinCode)
    hasJoinedRef.current = true
  }, [searchParams, isConnected, socket])

  const complete = pin.length === 6

  return (
    <div
      className="flex w-full flex-col items-center gap-6 px-5 pb-9 pt-7 md:flex-row md:items-center md:gap-20 md:px-20 md:py-16"
      style={{ animation: "slideUp 0.5s ease" }}
    >
      {/* Vinyl — top on mobile, left column on desktop */}
      <div className="flex flex-col items-center gap-4 md:flex-shrink-0">
        <div className="md:hidden">
          <VinylRecord size={160} color="#f43f5e" />
        </div>
        <div className="hidden md:block">
          <VinylRecord size={280} color="#f43f5e" />
        </div>
        <div style={{
          fontSize: "12px",
          letterSpacing: "5px",
          color: "rgba(245,230,200,0.4)",
          textTransform: "uppercase",
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
        }}>Muziek Quiz</div>
      </div>

      {/* Form — below on mobile, right column on desktop */}
      <div className="flex w-full flex-col gap-5 md:flex-1">
        {/* Desktop-only heading */}
        <div className="hidden md:block">
          <div style={{
            fontSize: "56px",
            fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
            letterSpacing: "4px",
            color: "#f5e6c8",
            lineHeight: 1,
          }}>MEEDOEN?</div>
          <div style={{
            fontSize: "18px",
            color: "rgba(245,230,200,0.5)",
            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
            marginTop: "8px",
          }}>Vul je PIN code in om mee te spelen</div>
        </div>

        <div className="flex flex-col gap-4">
          <div style={{
            fontSize: "11px",
            letterSpacing: "3px",
            color: "rgba(245,230,200,0.4)",
            textTransform: "uppercase",
            fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
          }}>Voer je PIN code in</div>

          <PinInput value={pin} onChange={setPin} onEnter={complete ? handleJoin : undefined} />

          <button
            onClick={handleJoin}
            disabled={!complete}
            className="w-full rounded-[8px] py-[14px] text-base md:rounded-[10px] md:py-5 md:text-[22px]"
            style={{
              border: "none",
              background: complete ? "linear-gradient(135deg, #f43f5e, #8b5cf6)" : "rgba(255,255,255,0.08)",
              color: complete ? "white" : "rgba(255,255,255,0.25)",
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              letterSpacing: "3px",
              cursor: complete ? "pointer" : "default",
              boxShadow: complete ? "0 8px 32px rgba(244,63,94,0.4)" : "none",
              transition: "all 0.3s",
            }}
          >
            {complete ? "▶ SPEEL MEE" : "VUL PIN IN"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Room
