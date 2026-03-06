import { CommonStatusDataMap } from "@rahoot/common/types/game/status"

type Props = {
  data: CommonStatusDataMap["SHOW_PREPARED"]
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

const VINYL_COLORS = ["#f43f5e", "#8b5cf6", "#06b6d4", "#f59e0b"]
const LABELS = ["A", "B", "C", "D"]

type MiniVinylProps = { size: number; color: string; label: string }

const MiniVinyl = ({ size, color, label }: MiniVinylProps) => (
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
      animation: "vinyl-spin 2s linear infinite",
      position: "relative",
      boxShadow: `0 0 16px ${color}55`,
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
        width: size * 0.42,
        height: size * 0.42,
        borderRadius: "50%",
        background: `radial-gradient(circle at 40% 35%, ${color}cc, ${color}77)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.18,
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

const Prepared = ({ data: { totalAnswers, questionNumber } }: Props) => (
  <section
    className="relative flex w-full flex-1 flex-col items-center justify-center gap-7 overflow-hidden px-5 py-10"
    style={{ background: VINYL_BG }}
  >
    <Spotlights />

    <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
      {/* Label */}
      <div
        style={{
          fontSize: "14px",
          letterSpacing: "4px",
          color: "rgba(245,230,200,0.4)",
          fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
          marginBottom: "16px",
        }}
      >
        🎵 VRAAG {questionNumber} KOMT ERAAN
      </div>

      {/* Big number — mobile */}
      <div
        className="md:hidden"
        style={{
          fontSize: "100px",
          fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
          color: "#8b5cf6",
          lineHeight: 1,
          textShadow: "0 0 60px rgba(139,92,246,0.8)",
          animation: "popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {questionNumber}
      </div>

      {/* Big number — desktop */}
      <div
        className="hidden md:block"
        style={{
          fontSize: "180px",
          fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
          lineHeight: 1,
          background: "linear-gradient(135deg, #f43f5e, #8b5cf6, #06b6d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 40px rgba(139,92,246,0.8))",
          animation: "popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {questionNumber}
      </div>

      {/* Vinyl discs row — mobile */}
      <div className="mt-5 flex justify-center gap-3 md:hidden">
        {VINYL_COLORS.slice(0, totalAnswers).map((color, i) => (
          <MiniVinyl key={i} size={36} color={color} label={LABELS[i]} />
        ))}
      </div>

      {/* Vinyl discs row — desktop */}
      <div className="mt-8 hidden justify-center gap-5 md:flex">
        {VINYL_COLORS.slice(0, totalAnswers).map((color, i) => (
          <MiniVinyl key={i} size={64} color={color} label={LABELS[i]} />
        ))}
      </div>
    </div>
  </section>
)

export default Prepared
