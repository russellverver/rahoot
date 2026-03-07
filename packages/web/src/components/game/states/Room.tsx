"use client"

import { Player } from "@rahoot/common/types/game"
import { ManagerStatusDataMap } from "@rahoot/common/types/game/status"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { useManagerStore } from "@rahoot/web/stores/manager"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import Link from "next/link"

type Props = {
  data: ManagerStatusDataMap["SHOW_ROOM"]
  onNext?: () => void
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;700;800&display=swap');

  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes vinylSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes eqBounce { 0%,100%{transform:scaleY(0.3)} 50%{transform:scaleY(1)} }
  @keyframes chipPop { from{transform:scale(0) rotate(-8deg);opacity:0} to{transform:scale(1) rotate(0deg);opacity:1} }
  @keyframes noteFloat { 0%{transform:translateY(0) rotate(-10deg);opacity:0} 10%{opacity:0.4} 90%{opacity:0.2} 100%{transform:translateY(-100px) rotate(15deg);opacity:0} }
  @keyframes bgPulse { 0%,100%{opacity:0.4} 50%{opacity:0.7} }
  @keyframes countPop { 0%{transform:scale(1.4);opacity:0} 100%{transform:scale(1);opacity:1} }
  @keyframes pulseRing { 0%{transform:scale(0.97);opacity:0.5} 100%{transform:scale(1.5);opacity:0} }
  @keyframes scanline { 0%{top:-2%} 100%{top:102%} }
  @keyframes dotPulse { 0%,100%{opacity:0.2} 50%{opacity:1} }
`

const CHIP_COLORS = ["#f43f5e", "#8b5cf6", "#06b6d4", "#f59e0b", "#4ade80"]

function EqBars({ color = "#8b5cf6", count = 4, height = 18 }: { color?: string; count?: number; height?: number }) {
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 2, background: color,
          height: `${35 + (i % 3) * 30}%`,
          animation: `eqBounce ${0.35 + i * 0.1}s ease-in-out infinite`,
          animationDelay: `${i * 0.07}s`,
        }} />
      ))}
    </div>
  )
}

function GlassCard({ children, accent = "#8b5cf6", style = {} }: { children: React.ReactNode; accent?: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "rgba(20,10,40,0.75)",
      backdropFilter: "blur(20px)",
      border: `1px solid ${accent}22`,
      borderRadius: 20,
      boxShadow: `0 0 0 1px ${accent}11, 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
      position: "relative",
      overflow: "hidden",
      ...style,
    }}>
      <div style={{
        position: "absolute", left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${accent}44, transparent)`,
        animation: "scanline 4s linear infinite", pointerEvents: "none",
      }} />
      {children}
    </div>
  )
}

const Room = ({ data: { text, inviteCode: initialInviteCode }, onNext }: Props) => {
  const { gameId } = useManagerStore()
  const { socket, webUrl } = useSocket()
  const { players } = useManagerStore()
  const [playerList, setPlayerList] = useState<Player[]>(players)
  const [totalPlayers, setTotalPlayers] = useState(0)
  const [inviteCode, setInviteCode] = useState(initialInviteCode)
  const [secondsLeft, setSecondsLeft] = useState(30)
  const [countKey, setCountKey] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 30 : s - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEvent("manager:newPlayer", (player) => {
    setPlayerList([...playerList, player])
    setCountKey((k) => k + 1)
  })

  useEvent("manager:removePlayer", (playerId) => {
    setPlayerList(playerList.filter((p) => p.id !== playerId))
  })

  useEvent("manager:playerKicked", (playerId) => {
    setPlayerList(playerList.filter((p) => p.id !== playerId))
  })

  useEvent("game:totalPlayers", (total) => {
    setTotalPlayers(total)
    setCountKey((k) => k + 1)
  })

  useEvent("manager:inviteCodeUpdate", ({ code, expiresAt }) => {
    setInviteCode(code)
    setSecondsLeft(Math.round((expiresAt - Date.now()) / 1000))
  })

  const handleKick = (playerId: string) => () => {
    if (!gameId) return
    socket?.emit("manager:kickPlayer", { gameId, playerId })
  }

  return (
    <>
      <style>{styles}</style>

      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: "32px 20px",
        fontFamily: "DM Sans, sans-serif",
        zIndex: 2,
        width: "100%",
      }}>

        {/* Background video */}
        <video
          autoPlay muted loop playsInline
          style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
          src="/videos/background.mp4"
        />
        {/* Dark overlay */}
        <div style={{ position: "fixed", inset: 0, background: "rgba(5,0,18,0.6)", zIndex: 1 }} />

        {/* Background glow orbs */}
        <div style={{ position: "fixed", top: "5%", left: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.07),transparent 70%)", pointerEvents: "none", animation: "bgPulse 5s ease infinite", zIndex: 1 }} />
        <div style={{ position: "fixed", bottom: "5%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(244,63,94,0.05),transparent 70%)", pointerEvents: "none", animation: "bgPulse 6s ease infinite 1s", zIndex: 1 }} />

        {/* Floating notes */}
        {["♪", "♫", "♩", "♬", "𝄞", "♪", "♫"].map((n, i) => (
          <div key={i} style={{
            position: "fixed",
            left: `${5 + i * 13}%`,
            bottom: `${5 + (i % 3) * 8}%`,
            fontSize: 14 + (i % 3) * 4,
            color: CHIP_COLORS[i % CHIP_COLORS.length] + "55",
            animation: `noteFloat ${8 + i * 1.2}s ease-in-out infinite`,
            animationDelay: `${i * 1.1}s`,
            pointerEvents: "none",
            zIndex: 1,
          }}>{n}</div>
        ))}

        {/* Title */}
        <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 11, letterSpacing: 6, color: "rgba(255,255,255,0.2)", fontFamily: "Bebas Neue, sans-serif", marginBottom: 6 }}>
            PRESTON PALACE
          </div>
          <div style={{
            fontSize: "clamp(36px,5vw,58px)",
            fontFamily: "Bebas Neue, sans-serif",
            letterSpacing: 6,
            lineHeight: 1,
            background: "linear-gradient(135deg, #f43f5e, #8b5cf6, #06b6d4)",
            backgroundSize: "300% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 5s linear infinite",
            filter: "drop-shadow(0 0 30px rgba(139,92,246,0.4))",
          }}>
            MUZIEK QUIZ
          </div>
        </div>

        {/* Join panel */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", alignItems: "stretch", position: "relative", zIndex: 2 }}>

          {/* Card 1 — Website */}
          <GlassCard accent="#f59e0b" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 4, justifyContent: "center", minWidth: 200 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "rgba(245,158,11,0.6)", fontFamily: "Bebas Neue, sans-serif", marginBottom: 6 }}>
              MEEDOEN? GA NAAR
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f5e6c8", lineHeight: 1.4, wordBreak: "break-all" }}>
              {webUrl}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
              <EqBars color="#f59e0b" count={4} height={14} />
              <span style={{ fontSize: 9, letterSpacing: 3, color: "rgba(245,158,11,0.4)", fontFamily: "Bebas Neue, sans-serif" }}>OF SCAN DE QR</span>
            </div>
          </GlassCard>

          {/* Card 2 — PIN (hero) */}
          <GlassCard accent="#8b5cf6" style={{ padding: "24px 36px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 20, border: "1px solid rgba(139,92,246,0.3)", animation: "pulseRing 2s ease-out infinite", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: 20, border: "1px solid rgba(139,92,246,0.2)", animation: "pulseRing 2s ease-out infinite", animationDelay: "0.6s", pointerEvents: "none" }} />

            <div style={{ fontSize: 10, letterSpacing: 5, color: "rgba(139,92,246,0.7)", fontFamily: "Bebas Neue, sans-serif" }}>
              GAME PIN
            </div>
            <div style={{
              fontSize: "clamp(52px,7vw,80px)",
              fontFamily: "Bebas Neue, sans-serif",
              letterSpacing: 12,
              lineHeight: 1,
              background: "linear-gradient(135deg, #a78bfa, #8b5cf6, #c4b5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px rgba(139,92,246,0.8))",
            }}>
              {inviteCode}
            </div>
            <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(139,92,246,0.4)", fontFamily: "Bebas Neue, sans-serif" }}>
              VOER IN OM MEE TE DOEN
            </div>

            {/* PIN timer */}
            <div style={{ width: "100%", marginTop: 8 }}>
              <div style={{ height: 4, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #8b5cf6, #a78bfa)",
                  width: `${(secondsLeft / 30) * 100}%`,
                  transition: "width 1s linear",
                }} />
              </div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "rgba(139,92,246,0.35)", fontFamily: "Bebas Neue, sans-serif", textAlign: "center", marginTop: 4 }}>
                NIEUWE PIN OVER {secondsLeft}S
              </div>
            </div>
          </GlassCard>

          {/* Card 3 — QR */}
          <GlassCard accent="#06b6d4" style={{ padding: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "rgba(6,182,212,0.6)", fontFamily: "Bebas Neue, sans-serif" }}>
              SCAN &amp; MEEDOEN
            </div>
            <div style={{ background: "white", borderRadius: 10, padding: 8 }}>
              <QRCode value={`${webUrl}?pin=${inviteCode}`} size={130} bgColor="#ffffff" fgColor="#0d0520" />
            </div>
            <div style={{ fontSize: 10, color: "rgba(6,182,212,0.4)", textAlign: "center" }}>{webUrl}</div>
          </GlassCard>
        </div>

        {/* Player count bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 28px", borderRadius: 999,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(74,222,128,0.25)",
          position: "relative", zIndex: 2,
        }}>
          <span style={{ fontSize: 18, color: "#4ade80" }}>♪</span>
          <span style={{ fontSize: 12, letterSpacing: 3, color: "rgba(255,255,255,0.3)", fontFamily: "Bebas Neue, sans-serif" }}>
            SPELERS AANGEMELD:
          </span>
          <span key={countKey} style={{
            fontSize: 32, fontFamily: "Bebas Neue, sans-serif", color: "#4ade80", letterSpacing: 2,
            textShadow: "0 0 15px rgba(74,222,128,0.7)",
            animation: "countPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            {totalPlayers}
          </span>
          <div style={{ display: "flex", gap: 2 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                fontSize: 16, color: "rgba(74,222,128,0.5)",
                animation: "dotPulse 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.25}s`,
              }}>.</span>
            ))}
          </div>
        </div>

        {/* Player chips */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center",
          maxWidth: 860, maxHeight: 140, overflow: "hidden",
          position: "relative", zIndex: 2,
        }}>
          {playerList.map((player, i) => (
            <div
              key={player.id}
              onClick={handleKick(player.id)}
              title="Klik om te kicken"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 16px", borderRadius: 999,
                background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)",
                border: `1px solid ${CHIP_COLORS[i % CHIP_COLORS.length]}22`,
                cursor: "pointer", transition: "all 0.2s",
                animation: "chipPop 0.4s cubic-bezier(0.34,1.56,0.64,1) backwards",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(244,63,94,0.4)"
                e.currentTarget.style.background = "rgba(244,63,94,0.08)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${CHIP_COLORS[i % CHIP_COLORS.length]}22`
                e.currentTarget.style.background = "rgba(255,255,255,0.05)"
              }}
            >
              <div style={{
                width: 12, height: 12, borderRadius: "50%",
                background: "#8b5cf6", flexShrink: 0,
              }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(245,230,200,0.75)" }}>
                {player.username}
              </span>
            </div>
          ))}
        </div>

        {/* Start button */}
        <button
          onClick={onNext}
          style={{
            padding: "14px 52px", borderRadius: 999,
            background: "linear-gradient(135deg, #4ade80, #22c55e, #16a34a)",
            border: "none", cursor: "pointer",
            fontFamily: "Bebas Neue, sans-serif", fontSize: 22, letterSpacing: 5, color: "white",
            boxShadow: "0 0 40px rgba(74,222,128,0.5), 0 6px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            transition: "transform 0.15s, filter 0.15s",
            position: "relative", zIndex: 2,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.filter = "brightness(1.1)" }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.filter = "" }}
        >
          ▶ &nbsp; START DE QUIZ
        </button>

        {/* Spectator link */}
        <Link
          href={`/spectator?pin=${inviteCode}`}
          target="_blank"
          style={{
            fontSize: 12, letterSpacing: 3, color: "rgba(245,158,11,0.5)",
            fontFamily: "Bebas Neue, sans-serif",
            textDecoration: "none",
            position: "relative", zIndex: 2,
          }}
        >
          ↗ OPEN LEADERBOARD SCHERM
        </Link>

      </section>
    </>
  )
}

export default Room
