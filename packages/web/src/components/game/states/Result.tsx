"use client"

import { CommonStatusDataMap } from "@rahoot/common/types/game/status"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { SFX_RESULTS_SOUND } from "@rahoot/web/utils/constants"
import { useEffect } from "react"
import useSound from "use-sound"

type Props = {
  data: CommonStatusDataMap["SHOW_RESULT"]
}

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
          width: "2px",
          height: "140%",
          background: `linear-gradient(to bottom, ${color}55, transparent)`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: "top center",
          animation: `beamPulse ${3 + i * 0.7}s ease-in-out infinite`,
          animationDelay: `${i * 0.5}s`,
        }}
      />
    ))}
  </div>
)

const MUSIC_NOTES = ["♩", "♪", "♫", "♬", "𝄞"]
const NOTE_COLORS = ["#f43f5e", "#8b5cf6", "#06b6d4", "#f59e0b", "#4ade80"]

const EqBars = ({ color, count = 4 }: { color: string; count?: number }) => (
  <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "20px" }}>
    {Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        style={{
          width: "3px",
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

const GROOVE_RATIOS = [0.85, 0.7, 0.55]

const ResultVinyl = ({ correct, size }: { correct: boolean; size: number }) => {
  const accentColor = correct ? "#4ade80" : "#f43f5e"
  const centerGradient = correct
    ? "radial-gradient(circle at 40% 35%, #4ade80, #16a34a)"
    : "radial-gradient(circle at 40% 35%, #f43f5e, #be123c)"
  const vinylBg = correct
    ? "conic-gradient(#0a2000 0deg, #1a3500 30deg, #0a2000 90deg, #1a3500 180deg, #0a2000 360deg)"
    : "conic-gradient(#200a0a 0deg, #350a0a 30deg, #200a0a 90deg, #350a0a 180deg, #200a0a 360deg)"
  const grooveColor = correct ? "rgba(74,222,128,0.08)" : "rgba(244,63,94,0.08)"
  const glow = correct ? "rgba(74,222,128,0.6)" : "rgba(244,63,94,0.5)"
  const glow2 = correct ? "rgba(74,222,128,0.3)" : "rgba(244,63,94,0.2)"
  const centerPx = Math.round(size * 0.38)

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
        animation: "popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {/* Spinning disc */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: vinylBg,
          animation: "vinyl-spin 4s linear infinite",
          boxShadow: `0 0 60px ${glow}, 0 0 120px ${glow2}`,
        }}
      >
        {GROOVE_RATIOS.map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              borderRadius: "50%",
              width: `${r * 100}%`,
              height: `${r * 100}%`,
              top: `${(1 - r) * 50}%`,
              left: `${(1 - r) * 50}%`,
              border: `0.5px solid ${grooveColor}`,
            }}
          />
        ))}
      </div>

      {/* Static center label */}
      <div
        style={{
          position: "absolute",
          width: `${centerPx}px`,
          height: `${centerPx}px`,
          top: `${(size - centerPx) / 2}px`,
          left: `${(size - centerPx) / 2}px`,
          borderRadius: "50%",
          background: centerGradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.17,
          color: "white",
          zIndex: 2,
          boxShadow: `0 0 20px ${accentColor}cc`,
        }}
      >
        {correct ? "✓" : "✗"}
      </div>
    </div>
  )
}

const Result = ({
  data: { correct, message, points, myPoints, rank, aheadOfMe },
}: Props) => {
  const player = usePlayerStore()

  const [sfxResults] = useSound(SFX_RESULTS_SOUND, { volume: 0.2 })

  useEffect(() => {
    player.updatePoints(myPoints)
    sfxResults()
  }, [sfxResults])

  const accentColor = correct ? "#4ade80" : "#f43f5e"
  const bg = correct
    ? "linear-gradient(160deg, #0d0520 0%, #0a2a15 50%, #05101a 100%)"
    : "linear-gradient(160deg, #0d0520 0%, #2a0510 50%, #05101a 100%)"
  const ptsBg = correct ? "74,222,128" : "244,63,94"

  return (
    <section
      className="relative mx-auto flex w-full flex-1 flex-col items-center justify-center gap-8 px-5 py-10 md:flex-row md:justify-center md:gap-20 md:px-20 md:py-16"
      style={{ background: bg, animation: "slideUp 0.5s ease", overflow: "hidden" }}
    >
      <Spotlights />

      {/* Music notes — only on correct */}
      {correct &&
        NOTE_COLORS.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: `${10 + i * 18}%`,
              fontSize: "18px",
              color: c,
              pointerEvents: "none",
              zIndex: 1,
              animation: `confettiFall ${2.5 + (i * 0.3) % 1.5}s ease ${i * 0.3}s infinite`,
            }}
          >
            {MUSIC_NOTES[i % MUSIC_NOTES.length]}
          </div>
        ))}

      {/* Vinyl — mobile */}
      <div className="flex-shrink-0 md:hidden" style={{ position: "relative", zIndex: 2 }}>
        <ResultVinyl correct={correct} size={140} />
      </div>

      {/* Vinyl — desktop */}
      <div className="hidden flex-shrink-0 md:block" style={{ position: "relative", zIndex: 2 }}>
        <ResultVinyl correct={correct} size={200} />
      </div>

      {/* Text */}
      <div
        className="flex flex-col items-center gap-5 text-center md:items-start md:text-left"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div
          style={{
            fontSize: "14px",
            letterSpacing: "4px",
            color: accentColor,
            fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
          }}
        >
          {correct ? "CORRECT!" : "HELAAS!"}
        </div>

        <div
          className="text-[28px] md:text-[52px]"
          style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
            letterSpacing: "3px",
            color: "white",
            lineHeight: 1,
          }}
        >
          {message}
        </div>

        <div
          style={{
            fontSize: "14px",
            color: "rgba(245,230,200,0.5)",
            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          }}
        >
          {`Rang ${rank}${aheadOfMe ? ` · achter ${aheadOfMe}` : ""}`}
        </div>

        {/* Points badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 28px",
            borderRadius: "999px",
            background: correct ? `rgba(${ptsBg},0.15)` : `rgba(${ptsBg},0.10)`,
            border: correct ? "2px solid #4ade80" : "2px solid rgba(244,63,94,0.4)",
            boxShadow: correct ? "0 0 30px rgba(74,222,128,0.3)" : "none",
            animation: "pointsCount 0.5s 0.3s ease backwards",
          }}
        >
          {correct && <EqBars color={accentColor} />}
          <span
            style={{
              fontSize: "28px",
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              color: correct ? accentColor : `rgba(${ptsBg},0.7)`,
              letterSpacing: "2px",
            }}
          >
            {correct ? `+${points} PTS` : "GEEN PUNTEN"}
          </span>
          {correct && <EqBars color={accentColor} />}
        </div>
      </div>
    </section>
  )
}

export default Result
