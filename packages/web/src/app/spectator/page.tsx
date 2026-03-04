"use client"

import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import Button from "@rahoot/web/components/Button"
import Form from "@rahoot/web/components/Form"
import Input from "@rahoot/web/components/Input"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { KeyboardEvent, Suspense, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

type Player = {
  id: string
  username: string
  points: number
}

const MEDAL_COLORS = [
  "border-amber-300 bg-amber-400 text-white",
  "border-zinc-300 bg-zinc-400 text-white",
  "border-amber-700 bg-amber-800 text-white",
]

const SpectatorContent = () => {
  const { socket, isConnected } = useSocket()
  const searchParams = useSearchParams()
  const hasJoinedRef = useRef(false)
  const [pin, setPin] = useState("")
  const [joined, setJoined] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])
  const [subject, setSubject] = useState("")

  const handleJoin = () => {
    if (!pin.trim()) return
    socket?.emit("spectator:joinByCode", pin.trim())
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") handleJoin()
  }

  useEffect(() => {
    const pinFromUrl = searchParams.get("pin")
    if (!isConnected || !pinFromUrl || hasJoinedRef.current) return
    hasJoinedRef.current = true
    socket?.emit("spectator:joinByCode", pinFromUrl)
  }, [isConnected, searchParams, socket])

  useEvent("game:errorMessage", (message) => {
    toast.error(message)
  })

  useEvent("spectator:leaderboard", ({ players, subject }) => {
    setJoined(true)
    setPlayers(players)
    setSubject(subject)
  })

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center px-6 py-10">
      <video
        className="pointer-events-none fixed top-0 left-0 -z-10 h-full w-full object-cover"
        src="/background.mov"
        autoPlay
        loop
        muted
        playsInline
      />

      <Image
        src="/logo.png"
        width={260}
        height={104}
        className="mb-8"
        alt="Preston Palace"
      />

      {!joined ? (
        <Form>
          <Input
            placeholder="Game PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={handleJoin}>Verbinden</Button>
        </Form>
      ) : (
        <>
          {subject && (
            <h1 className="mb-6 text-center text-3xl font-bold text-white drop-shadow-lg">
              {subject}
            </h1>
          )}

          {players.length === 0 ? (
            <p className="text-xl font-bold text-white/70">
              Wachten op spelers...
            </p>
          ) : (
            <div className="w-full max-w-2xl space-y-3">
              <AnimatePresence mode="popLayout">
                {players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    layout
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{
                      layout: { type: "spring", stiffness: 350, damping: 25 },
                    }}
                    className="flex items-center gap-4 rounded-xl bg-black/40 px-5 py-4 backdrop-blur-sm"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-lg font-bold ${
                        MEDAL_COLORS[index] ??
                        "border-white/30 bg-white/20 text-white"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="flex-1 text-2xl font-bold text-white drop-shadow">
                      {player.username}
                    </span>
                    <span className="text-2xl font-bold text-amber-300 drop-shadow">
                      {player.points}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </section>
  )
}

const SpectatorEntry = () => (
  <Suspense>
    <SpectatorContent />
  </Suspense>
)

export default SpectatorEntry
