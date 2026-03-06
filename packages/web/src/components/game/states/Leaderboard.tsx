import { ManagerStatusDataMap } from "@rahoot/common/types/game/status"
import { AnimatePresence, motion, useSpring, useTransform } from "motion/react"
import { useEffect, useState } from "react"

type Props = {
  data: ManagerStatusDataMap["SHOW_LEADERBOARD"]
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

const EqBars = ({
  color,
  count = 5,
  height = 24,
}: {
  color: string
  count?: number
  height?: number
}) => (
  <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height }}>
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

const AnimatedPoints = ({ from, to }: { from: number; to: number }) => {
  const spring = useSpring(from, { stiffness: 1000, damping: 30 })
  const display = useTransform(spring, (value) => Math.round(value))
  const [displayValue, setDisplayValue] = useState(from)

  useEffect(() => {
    spring.set(to)
    const unsubscribe = display.on("change", (latest) => {
      setDisplayValue(latest)
    })

    return unsubscribe
  }, [to, spring, display])

  return <span>{displayValue}</span>
}

const RANK_GRADIENTS = [
  "linear-gradient(135deg, #f59e0b, #d97706)",
  "linear-gradient(135deg, #9ca3af, #6b7280)",
  "linear-gradient(135deg, #b45309, #92400e)",
]
const RANK_GLOWS = [
  "rgba(245,158,11,0.6)",
  "rgba(156,163,175,0.3)",
  "rgba(180,83,9,0.3)",
]
const RANK_COLORS = ["#f59e0b", "#9ca3af", "#b45309"]
const VINYL_COLORS = ["#f59e0b", "#8b5cf6", "#06b6d4", "#f43f5e", "#4ade80"]

const Leaderboard = ({ data: { oldLeaderboard, leaderboard } }: Props) => {
  const [displayedLeaderboard, setDisplayedLeaderboard] =
    useState(oldLeaderboard)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setDisplayedLeaderboard(oldLeaderboard)
    setIsAnimating(false)

    const timer = setTimeout(() => {
      setIsAnimating(true)
      setDisplayedLeaderboard(leaderboard)
    }, 1600)

    return () => {
      clearTimeout(timer)
    }
  }, [oldLeaderboard, leaderboard])

  return (
    <section
      className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-10"
      style={{ background: VINYL_BG, overflow: "hidden" }}
    >
      <Spotlights />

      {/* Header */}
      <div
        className="mb-8 flex items-center gap-4"
        style={{ position: "relative", zIndex: 2 }}
      >
        <EqBars color="#f59e0b" count={6} height={36} />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              fontSize: "clamp(32px, 5vw, 52px)",
              letterSpacing: "4px",
              color: "white",
              lineHeight: 1,
            }}
          >
            LEADERBOARD
          </div>
        </div>
        <EqBars color="#f59e0b" count={6} height={36} />
      </div>

      {/* Rows */}
      <div className="flex w-full flex-col gap-2" style={{ position: "relative", zIndex: 2 }}>
        <AnimatePresence mode="popLayout">
          {displayedLeaderboard.map(({ id, username, points }, index) => {
            const rankGradient = RANK_GRADIENTS[index] ?? "rgba(255,255,255,0.1)"
            const rankGlow = RANK_GLOWS[index] ?? ""
            const rankColor = RANK_COLORS[index] ?? "rgba(245,230,200,0.6)"
            const vinylColor = VINYL_COLORS[index % VINYL_COLORS.length]
            const isFirst = index === 0

            return (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
                transition={{
                  layout: { type: "spring", stiffness: 350, damping: 25 },
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: isFirst ? "14px 20px" : "11px 14px",
                  borderRadius: "12px",
                  border: isFirst
                    ? "2px solid rgba(245,158,11,0.35)"
                    : "2px solid rgba(255,255,255,0.06)",
                  background: isFirst
                    ? "rgba(245,158,11,0.08)"
                    : "rgba(255,255,255,0.04)",
                  boxShadow: isFirst ? "0 0 20px rgba(245,158,11,0.15)" : "none",
                }}
              >
                {/* Rank circle */}
                <div
                  style={{
                    width: isFirst ? "40px" : "32px",
                    height: isFirst ? "40px" : "32px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: index < 3 ? rankGradient : "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isFirst ? "18px" : "14px",
                    fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
                    color: "white",
                    boxShadow: rankGlow ? `0 0 16px ${rankGlow}` : "none",
                  }}
                >
                  {isFirst ? "👑" : index + 1}
                </div>

                {/* Spinning vinyl dot */}
                <div
                  style={{
                    width: isFirst ? "36px" : "28px",
                    height: isFirst ? "36px" : "28px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background:
                      "conic-gradient(#111 0deg, #222 45deg, #111 90deg, #222 180deg, #111 360deg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1.5px solid ${vinylColor}44`,
                    animation: isFirst ? "vinyl-spin 3s linear infinite" : "none",
                  }}
                >
                  <div
                    style={{
                      width: "35%",
                      height: "35%",
                      borderRadius: "50%",
                      background: vinylColor,
                    }}
                  />
                </div>

                {/* Username */}
                <span
                  style={{
                    flex: 1,
                    fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
                    fontSize: isFirst ? "20px" : "16px",
                    fontWeight: isFirst ? 700 : 600,
                    color: "#f5e6c8",
                  }}
                >
                  {username}
                </span>

                {/* EqBars next to #1 points */}
                {isFirst && <EqBars color="#f59e0b" count={3} height={16} />}

                {/* Points */}
                <span
                  style={{
                    fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
                    fontSize: isFirst ? "22px" : "16px",
                    letterSpacing: "1px",
                    color: isFirst ? rankColor : "rgba(245,230,200,0.6)",
                  }}
                >
                  {isAnimating ? (
                    <AnimatedPoints
                      from={oldLeaderboard.find((u) => u.id === id)?.points || 0}
                      to={leaderboard.find((u) => u.id === id)?.points || 0}
                    />
                  ) : (
                    points
                  )}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Leaderboard
