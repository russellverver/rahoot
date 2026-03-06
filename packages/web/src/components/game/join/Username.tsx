"use client"

import { STATUS } from "@rahoot/common/types/game/status"
import VinylRecord from "@rahoot/web/components/VinylRecord"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { useRouter } from "next/navigation"
import { KeyboardEvent, useState } from "react"

const Username = () => {
  const { socket } = useSocket()
  const { gameId, login, setStatus } = usePlayerStore()
  const router = useRouter()
  const [username, setUsername] = useState("")

  const handleLogin = () => {
    if (!gameId) {
      return
    }

    socket?.emit("player:login", { gameId, data: { username } })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleLogin()
    }
  }

  useEvent("game:successJoin", (gameId) => {
    setStatus(STATUS.WAIT, { text: "Waiting for the players" })
    login(username)

    router.replace(`/game/${gameId}`)
  })

  const ready = username.trim().length > 0

  return (
    <div
      className="flex w-full flex-col items-center gap-6 px-5 pb-9 pt-7 md:flex-row md:items-center md:gap-20 md:px-20 md:py-16"
      style={{ animation: "slideUp 0.5s ease" }}
    >
      {/* Vinyl — top on mobile, left column on desktop */}
      <div className="flex-shrink-0">
        <div className="md:hidden">
          <VinylRecord size={160} color="#8b5cf6" spinning />
        </div>
        <div className="hidden md:block">
          <VinylRecord size={280} color="#8b5cf6" spinning />
        </div>
      </div>

      {/* Form — below on mobile, right column on desktop */}
      <div className="flex w-full flex-col gap-5 md:flex-1">
        <div>
          <div
            className="text-[28px] md:text-[52px]"
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              letterSpacing: "3px",
              color: "#f5e6c8",
              lineHeight: 1,
            }}
          >WAT IS JE NAAM?</div>
          <div
            className="mt-1 text-[12px] md:mt-2 md:text-[18px]"
            style={{
              letterSpacing: "3px",
              color: "rgba(245,230,200,0.4)",
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
            }}
          >Dit zien andere spelers</div>
        </div>

        <div className="flex flex-col gap-3">
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Jouw naam..."
            className="w-full rounded-[8px] px-5 py-4 text-[18px] md:px-6 md:py-5 md:text-[22px]"
            style={{
              border: ready ? "2px solid #8b5cf6" : "2px solid rgba(255,200,100,0.15)",
              background: "rgba(30,15,0,0.7)",
              backdropFilter: "blur(10px)",
              color: "#f5e6c8",
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              fontWeight: 600,
              outline: "none",
              transition: "all 0.2s",
              boxShadow: ready ? "0 0 20px rgba(139,92,246,0.3)" : "none",
            }}
          />
          <button
            onClick={handleLogin}
            disabled={!ready}
            className="w-full rounded-[8px] py-4 text-[18px] md:rounded-[10px] md:py-5 md:text-[22px]"
            style={{
              border: "none",
              background: ready ? "linear-gradient(135deg, #8b5cf6, #06b6d4)" : "rgba(255,255,255,0.08)",
              color: ready ? "white" : "rgba(255,255,255,0.25)",
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              letterSpacing: "3px",
              cursor: ready ? "pointer" : "default",
              boxShadow: ready ? "0 8px 32px rgba(139,92,246,0.4)" : "none",
              transition: "all 0.3s",
            }}
          >
            {ready ? "▶ VERDER" : "VOEL JE NAAM IN"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Username
