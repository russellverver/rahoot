"use client"

import { CommonStatusDataMap } from "@rahoot/common/types/game/status"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { SFX_ANSWERS_MUSIC, SFX_ANSWERS_SOUND } from "@rahoot/web/utils/constants"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import useSound from "use-sound"

type Props = {
  data: CommonStatusDataMap["SELECT_ANSWER"]
  manager?: boolean
}

const VINYL_BG = "linear-gradient(160deg, #0d0520 0%, #1a0a35 50%, #05101a 100%)"
const VINYL_COLORS = ["#f43f5e", "#8b5cf6", "#06b6d4", "#f59e0b"]
const LABELS = ["A", "B", "C", "D"]

const BEAM_DATA: [number, string][] = [
  [-20, "#f43f5e"],
  [10, "#8b5cf6"],
  [35, "#06b6d4"],
  [60, "#f59e0b"],
]

const Spotlights = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    {BEAM_DATA.map(([angle, color], i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          top: "-20%",
          left: `${15 + i * 22}%`,
          width: "3px",
          height: "140%",
          background: `linear-gradient(to bottom, ${color}44, transparent)`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: "top center",
          animation: `beamPulse ${3 + i * 0.7}s ease-in-out infinite`,
          animationDelay: `${i * 0.5}s`,
        }}
      />
    ))}
  </div>
)

const EqBars = ({ color, count = 5, height = 28 }: { color: string; count?: number; height?: number }) => (
  <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height }}>
    {Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        style={{
          width: "4px",
          borderRadius: "2px",
          background: color,
          height: `${40 + (i % 3) * 30}%`,
          transformOrigin: "bottom",
          animation: `eqBounce ${0.4 + i * 0.1}s ease infinite`,
          animationDelay: `${i * 0.08}s`,
        }}
      />
    ))}
  </div>
)

type VinylDiscProps = { size: number; color: string; label: string; spinning: boolean }

const VinylDisc = ({ size, color, label, spinning }: VinylDiscProps) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      flexShrink: 0,
      background:
        "conic-gradient(#1a0a00 0deg, #2a1200 20deg, #150800 40deg, #221000 80deg, #180800 120deg, #2a1400 180deg, #1a0a00 240deg, #221400 300deg, #1a0a00 360deg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: spinning ? "vinyl-spin 2s linear infinite" : "none",
      position: "relative",
    }}
  >
    {[0.7, 0.55].map((r, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          width: `${size * r}px`,
          height: `${size * r}px`,
          borderRadius: "50%",
          border: "0.5px solid rgba(255,150,50,0.1)",
        }}
      />
    ))}
    <div
      style={{
        width: size * 0.36,
        height: size * 0.36,
        borderRadius: "50%",
        background: `radial-gradient(circle at 40% 35%, ${color}cc, ${color}77)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.16,
        fontWeight: 900,
        color: "white",
        fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
        zIndex: 2,
        position: "relative",
      }}
    >
      {label}
    </div>
  </div>
)

const Answers = ({
  data: { question, answers, image, audio, video, time, totalPlayer },
  manager,
}: Props) => {
  const { gameId }: { gameId?: string } = useParams()
  const { socket } = useSocket()
  const { player } = usePlayerStore()

  const [cooldown, setCooldown] = useState(time)
  const [totalAnswer, setTotalAnswer] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const [sfxPop] = useSound(SFX_ANSWERS_SOUND, {
    volume: 0.1,
  })

  const [playMusic, { stop: stopMusic }] = useSound(SFX_ANSWERS_MUSIC, {
    volume: 0.2,
    interrupt: true,
    loop: true,
  })

  const handlePlayerAnswer = (i: number) => {
    if (selectedIndex !== null || !player) return
    setSelectedIndex(i)
    socket?.emit("player:selectedAnswer", {
      gameId,
      data: { answerKey: i },
    })
    sfxPop()
  }

  useEffect(() => {
    if (video || audio) {
      return
    }

    playMusic()

    // eslint-disable-next-line consistent-return
    return () => {
      stopMusic()
    }
  }, [playMusic])

  useEvent("game:cooldown", (sec) => {
    setCooldown(sec)
  })

  useEvent("game:playerAnswer", (count) => {
    setTotalAnswer(count)
    sfxPop()
  })

  const urgent = cooldown <= 5
  const pct = (cooldown / time) * 100

  // ── Player view ──────────────────────────────────────────────────────────────
  if (!manager) {
    return (
      <section
        className="relative flex w-full flex-1 flex-col overflow-hidden"
        style={{ background: VINYL_BG }}
      >
        <Spotlights />

        {/* Scanline sweep */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)",
            animation: "scanline 4s linear infinite",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 py-3 md:px-10 md:py-5"
          style={{ position: "relative", zIndex: 2 }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <EqBars color="#8b5cf6" count={3} height={20} />
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "3px",
                color: "rgba(245,230,200,0.4)",
                fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              }}
            >
              MUZIEK QUIZ
            </div>
            <EqBars color="#06b6d4" count={3} height={20} />
          </div>

          {/* Circular timer — mobile */}
          <div
            className="md:hidden"
            style={{
              width: "54px",
              height: "54px",
              borderRadius: "50%",
              border: urgent ? "3px solid #f43f5e" : "3px solid #8b5cf6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              background: urgent ? "rgba(244,63,94,0.15)" : "rgba(139,92,246,0.15)",
              boxShadow: urgent
                ? "0 0 16px rgba(244,63,94,0.3)"
                : "0 0 16px rgba(139,92,246,0.3)",
              animation: urgent ? "timerPulse 0.5s ease infinite" : "none",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
                color: urgent ? "#f43f5e" : "white",
                lineHeight: 1,
              }}
            >
              {cooldown}
            </div>
            <div
              style={{
                fontSize: "7px",
                letterSpacing: "1px",
                color: "rgba(255,255,255,0.4)",
                fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              }}
            >
              SEC
            </div>
          </div>

          {/* Circular timer — desktop */}
          <div
            className="hidden md:flex"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: urgent ? "3px solid #f43f5e" : "3px solid #8b5cf6",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              background: urgent ? "rgba(244,63,94,0.15)" : "rgba(139,92,246,0.15)",
              boxShadow: urgent
                ? "0 0 20px rgba(244,63,94,0.3)"
                : "0 0 20px rgba(139,92,246,0.3)",
              animation: urgent ? "timerPulse 0.5s ease infinite" : "none",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
                color: urgent ? "#f43f5e" : "white",
                lineHeight: 1,
              }}
            >
              {cooldown}
            </div>
            <div
              style={{
                fontSize: "9px",
                letterSpacing: "2px",
                color: "rgba(255,255,255,0.4)",
                fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              }}
            >
              SEC
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: "5px",
            background: "rgba(255,255,255,0.05)",
            margin: "0 16px",
            borderRadius: "999px",
            overflow: "hidden",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #f43f5e, #8b5cf6, #06b6d4)",
              width: `${pct}%`,
              transition: "width 1s linear",
            }}
          />
        </div>

        {/* Question */}
        <div
          className="flex-shrink-0 px-4 py-3 md:px-10 md:py-5"
          style={{ position: "relative", zIndex: 2, textAlign: "center" }}
        >
          <p
            style={{
              fontSize: "clamp(15px, 3vw, 24px)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.3,
              textShadow: "0 0 30px rgba(139,92,246,0.5)",
              animation: "slideDown 0.5s ease",
              fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
            }}
          >
            {question}
          </p>
        </div>

        {/* Answer grid */}
        <div
          className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-2 overflow-auto px-4 pb-3 md:grid-cols-2 md:gap-3 md:px-10 md:pb-6"
          style={{ position: "relative", zIndex: 2, alignContent: "start" }}
        >
          {answers.map((answer, i) => {
            const color = VINYL_COLORS[i]
            const isSelected = selectedIndex === i
            const isDimmed = selectedIndex !== null && !isSelected
            return (
              <button
                key={i}
                onClick={() => handlePlayerAnswer(i)}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px 10px 10px",
                  borderRadius: "10px",
                  border: isSelected ? `2px solid ${color}` : `2px solid ${color}44`,
                  background: isSelected ? `${color}18` : `${color}0a`,
                  opacity: isDimmed ? 0.4 : 1,
                  transition: "all 0.25s",
                  cursor: selectedIndex === null ? "pointer" : "default",
                  color: "inherit",
                  textAlign: "left",
                  width: "100%",
                  boxShadow: isSelected ? `0 0 20px ${color}33` : "none",
                }}
              >
                {/* Shimmer */}
                {!isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      height: "100%",
                      width: "60%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
                      transform: "skewX(-20deg)",
                      animation: `shimmer ${3 + i * 0.5}s ease infinite`,
                      animationDelay: `${i * 0.7}s`,
                    }}
                  />
                )}

                {/* VinylDisc — mobile */}
                <div className="md:hidden">
                  <VinylDisc size={52} color={color} label={LABELS[i]} spinning={isSelected} />
                </div>
                {/* VinylDisc — desktop */}
                <div className="hidden md:block">
                  <VinylDisc size={72} color={color} label={LABELS[i]} spinning={isSelected} />
                </div>

                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(13px, 1.8vw, 18px)",
                    fontWeight: 600,
                    color: isSelected ? "#f5e6c8" : "rgba(245,230,200,0.8)",
                    lineHeight: 1.3,
                  }}
                >
                  {answer}
                </span>
                {isSelected && (
                  <span style={{ fontSize: "20px", color, flexShrink: 0 }}>♪</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Confirmation */}
        {selectedIndex !== null && (
          <div
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#4ade80",
              letterSpacing: "2px",
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              padding: "8px 0 12px",
              position: "relative",
              zIndex: 2,
            }}
          >
            Antwoord verstuurd ✓
          </div>
        )}
      </section>
    )
  }

  // ── Manager view ─────────────────────────────────────────────────────────────
  return (
    <div
      className="relative flex h-full flex-1 flex-col overflow-hidden"
      style={{ background: VINYL_BG }}
    >
      <Spotlights />

      {/* Scanline sweep */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)",
          animation: "scanline 4s linear infinite",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-4 md:px-10 md:py-5"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <EqBars color="#8b5cf6" />
          <div
            style={{
              fontSize: "13px",
              letterSpacing: "4px",
              color: "rgba(245,230,200,0.4)",
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
            }}
          >
            MUZIEK QUIZ
          </div>
          <EqBars color="#06b6d4" />
        </div>

        {/* Circular timer */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: urgent ? "3px solid #f43f5e" : "3px solid #8b5cf6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            background: urgent
              ? "rgba(244,63,94,0.15)"
              : "rgba(139,92,246,0.15)",
            boxShadow: urgent
              ? "0 0 20px rgba(244,63,94,0.3)"
              : "0 0 20px rgba(139,92,246,0.3)",
            animation: urgent ? "timerPulse 0.5s ease infinite" : "none",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              color: urgent ? "#f43f5e" : "white",
              lineHeight: 1,
            }}
          >
            {cooldown}
          </div>
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "2px",
              color: "rgba(255,255,255,0.4)",
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
            }}
          >
            SEC
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: "6px",
          background: "rgba(255,255,255,0.05)",
          margin: "0 24px",
          borderRadius: "999px",
          overflow: "hidden",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: "999px",
            background: "linear-gradient(90deg, #f43f5e, #8b5cf6, #06b6d4)",
            width: `${pct}%`,
            transition: "width 1s linear",
          }}
        />
      </div>

      {/* Question area */}
      <div
        className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-5 px-8 py-6 md:px-16 md:py-8"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div
          style={{
            fontSize: "13px",
            letterSpacing: "5px",
            color: "rgba(245,230,200,0.3)",
            fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
            marginBottom: "8px",
          }}
        >
          🎵 MUZIEK QUIZ
        </div>
        <h2
          style={{
            fontSize: "clamp(20px, 3.5vw, 42px)",
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
            lineHeight: 1.3,
            textShadow: "0 0 40px rgba(139,92,246,0.5)",
            animation: "slideDown 0.6s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {question}
        </h2>

        {Boolean(audio) && !player && (
          <audio className="m-4 mb-2 w-auto rounded-md" src={audio} autoPlay controls />
        )}

        {Boolean(video) && !player && (
          <video
            className="m-4 mb-2 aspect-video max-h-60 w-auto rounded-md px-4 sm:max-h-100"
            src={video}
            autoPlay
            controls
          />
        )}

        {Boolean(image) && (
          <img
            alt={question}
            src={image}
            className="mb-2 max-h-60 w-auto rounded-md px-4 sm:max-h-100"
          />
        )}
      </div>

      {/* Bottom: answer count + answer grid */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Answer count */}
        <div className="mx-auto flex w-full max-w-7xl justify-end px-4 pb-3 md:px-10">
          <div
            style={{
              padding: "4px 16px",
              borderRadius: "999px",
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              fontSize: "16px",
              color: "rgba(245,230,200,0.6)",
              letterSpacing: "1px",
            }}
          >
            {totalAnswer}/{totalPlayer} antwoorden
          </div>
        </div>

        {/* Answer grid */}
        <div className="mx-auto mb-4 grid w-full max-w-7xl grid-cols-2 gap-3 px-4 pb-4 md:mb-6 md:px-10 md:pb-8">
          {answers.map((answer, i) => {
            const color = VINYL_COLORS[i]
            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 16px 10px 10px",
                  borderRadius: "10px",
                  border: `2px solid ${color}44`,
                  background: `${color}0a`,
                }}
              >
                {/* Shimmer */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    height: "100%",
                    width: "60%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
                    transform: "skewX(-20deg)",
                    animation: `shimmer ${3 + i * 0.5}s ease infinite`,
                    animationDelay: `${i * 0.7}s`,
                  }}
                />
                <VinylDisc size={72} color={color} label={LABELS[i]} spinning={false} />
                <span
                  style={{
                    flex: 1,
                    fontSize: "clamp(13px, 1.8vw, 18px)",
                    fontWeight: 600,
                    color: "#f5e6c8",
                    lineHeight: 1.3,
                  }}
                >
                  {answer}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Answers
