"use client"

import { CommonStatusDataMap } from "@rahoot/common/types/game/status"
import { SFX_SHOW_SOUND } from "@rahoot/web/utils/constants"
import { useEffect } from "react"
import useSound from "use-sound"

type Props = {
  data: CommonStatusDataMap["SHOW_QUESTION"]
  manager?: boolean
}

const VINYL_BG = "linear-gradient(160deg, #0d0520 0%, #1a0a35 50%, #05101a 100%)"

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

const EqBars = ({ color, count = 6, height = 32 }: { color: string; count?: number; height?: number }) => (
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

const Question = ({ data: { question, image, cooldown }, manager }: Props) => {
  const [sfxShow] = useSound(SFX_SHOW_SOUND, { volume: 0.5 })

  useEffect(() => {
    sfxShow()
  }, [sfxShow])

  // ── Player view ──────────────────────────────────────────────────────────────
  if (!manager) {
    return (
      <section
        className="relative flex w-full flex-1 flex-col overflow-hidden"
        style={{ background: VINYL_BG }}
      >
        <Spotlights />

        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ position: "relative", zIndex: 2 }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "3px",
              color: "rgba(245,230,200,0.4)",
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
            }}
          >
            🎵 VRAAG
          </div>
          <div
            style={{
              padding: "3px 12px",
              borderRadius: "999px",
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: "13px",
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              color: "white",
              letterSpacing: "1px",
            }}
          >
            ⏱ {cooldown}s
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: "3px",
            background: "rgba(255,255,255,0.08)",
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
              background: "linear-gradient(90deg, #f43f5e, #8b5cf6)",
              borderRadius: "999px",
              animation: `progressBar ${cooldown}s linear forwards`,
            }}
          />
        </div>

        {/* Question */}
        <div
          className="flex flex-1 items-center justify-center px-5 py-8"
          style={{ position: "relative", zIndex: 2 }}
        >
          <div style={{ textAlign: "center", maxWidth: "500px" }}>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "white",
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                lineHeight: 1.4,
                textShadow: "0 0 30px rgba(139,92,246,0.5)",
                animation: "slideDown 0.5s ease",
              }}
            >
              {question}
            </h2>
          </div>
        </div>

        {Boolean(image) && (
          <div
            className="flex justify-center px-5 pb-5"
            style={{ position: "relative", zIndex: 2 }}
          >
            <img alt={question} src={image} className="max-h-40 w-auto rounded-md" />
          </div>
        )}
      </section>
    )
  }

  // ── Manager view ─────────────────────────────────────────────────────────────
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
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)",
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
        {/* Left: EqBars + label */}
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

        {/* Right: Circular timer */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            border: "3px solid #8b5cf6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            background: "rgba(139,92,246,0.15)",
            boxShadow: "0 0 20px rgba(139,92,246,0.3)",
          }}
        >
          <div
            style={{
              fontSize: "26px",
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              color: "white",
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
            animation: `progressBar ${cooldown}s linear forwards`,
          }}
        />
      </div>

      {/* Question */}
      <div
        className="flex flex-1 items-center justify-center px-8 py-6 md:px-20 md:py-10"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div style={{ textAlign: "center", maxWidth: "800px" }}>
          <div
            style={{
              fontSize: "13px",
              letterSpacing: "5px",
              color: "rgba(245,230,200,0.3)",
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              marginBottom: "16px",
            }}
          >
            🎵 MUZIEK QUIZ
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 52px)",
              fontWeight: 700,
              color: "white",
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              letterSpacing: "2px",
              lineHeight: 1.2,
              textShadow: "0 0 60px rgba(139,92,246,0.6), 0 4px 20px rgba(0,0,0,0.8)",
              animation: "slideDown 0.6s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {question}
          </h2>

          {Boolean(image) && (
            <img
              alt={question}
              src={image}
              className="mt-6 max-h-60 w-auto rounded-md sm:max-h-100"
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default Question
