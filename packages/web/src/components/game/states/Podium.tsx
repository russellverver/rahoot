"use client"

import { ManagerStatusDataMap } from "@rahoot/common/types/game/status"
import useScreenSize from "@rahoot/web/hooks/useScreenSize"
import {
  SFX_PODIUM_FIRST,
  SFX_PODIUM_SECOND,
  SFX_PODIUM_THREE,
  SFX_SNEAR_ROOL,
} from "@rahoot/web/utils/constants"
import clsx from "clsx"
import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"
import useSound from "use-sound"

type Props = {
  data: ManagerStatusDataMap["FINISHED"]
}

const VINYL_BG = "linear-gradient(160deg, #0d0520 0%, #1a0a35 50%, #05101a 100%)"

const BEAM_DATA: [number, string][] = [
  [-20, "#f43f5e"],
  [10, "#8b5cf6"],
  [35, "#06b6d4"],
  [60, "#f59e0b"],
]

const MUSIC_NOTES = ["♩", "♪", "♫", "♬", "𝄞", "♩", "♪", "♫"]
const NOTE_COLORS = ["#f43f5e", "#8b5cf6", "#06b6d4", "#f59e0b", "#4ade80", "#f43f5e", "#8b5cf6", "#06b6d4"]

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

const GROOVE_RATIOS = [0.85, 0.7, 0.55, 0.42]

type BigVinylProps = {
  size: number
  color: string
  spinning?: boolean
  label: string
}

const BigVinyl = ({ size, color, spinning, label }: BigVinylProps) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      flexShrink: 0,
      background:
        "conic-gradient(#1a0a00 0deg, #2a1200 15deg, #150800 30deg, #221000 60deg, #180800 90deg, #2a1400 140deg, #1a0a00 200deg, #221400 260deg, #1a0a00 320deg, #2a1200 360deg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: spinning ? "vinyl-spin 3s linear infinite" : "none",
      position: "relative",
      boxShadow: `0 0 40px ${color}55, 0 10px 40px rgba(0,0,0,0.8)`,
    }}
  >
    {GROOVE_RATIOS.map((r, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          width: `${size * r}px`,
          height: `${size * r}px`,
          borderRadius: "50%",
          border: "0.5px solid rgba(255,150,50,0.07)",
        }}
      />
    ))}
    <div
      style={{
        width: size * 0.36,
        height: size * 0.36,
        borderRadius: "50%",
        background: `radial-gradient(circle at 40% 35%, ${color}cc, ${color}66)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 20px ${color}88`,
        zIndex: 2,
        position: "relative",
        fontSize: size * 0.14,
        fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
        color: "white",
      }}
    >
      {label}
    </div>
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.06), transparent 60%)",
      }}
    />
  </div>
)

const Podium = ({ data: { subject, top } }: Props) => {
  const [apparition, setApparition] = useState(0)

  const { width, height } = useScreenSize()

  const [sfxtThree] = useSound(SFX_PODIUM_THREE, { volume: 0.2 })
  const [sfxSecond] = useSound(SFX_PODIUM_SECOND, { volume: 0.2 })
  const [sfxRool, { stop: sfxRoolStop }] = useSound(SFX_SNEAR_ROOL, { volume: 0.2 })
  const [sfxFirst] = useSound(SFX_PODIUM_FIRST, { volume: 0.2 })

  useEffect(() => {
    switch (apparition) {
      case 4:
        sfxRoolStop()
        sfxFirst()
        break

      case 3:
        sfxRool()
        break

      case 2:
        sfxSecond()
        break

      case 1:
        sfxtThree()
        break
    }
  }, [apparition, sfxFirst, sfxSecond, sfxtThree, sfxRool, sfxRoolStop])

  useEffect(() => {
    if (top.length < 3) {
      setApparition(4)

      return
    }

    const interval = setInterval(() => {
      if (apparition > 4) {
        clearInterval(interval)

        return
      }

      setApparition((value) => value + 1)
    }, 2000)

    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval)
  }, [apparition, top.length])

  return (
    <>
      {apparition >= 4 && (
        <ReactConfetti width={width} height={height} className="h-full w-full" />
      )}

      {apparition >= 3 && top.length >= 3 && (
        <div className="pointer-events-none absolute min-h-dvh w-full overflow-hidden">
          <div className="spotlight"></div>
        </div>
      )}

      {/* Falling music notes */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {NOTE_COLORS.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: `${5 + i * 12}%`,
              fontSize: "18px",
              color: c,
              animation: `confettiFall ${2.5 + (i % 3) * 0.5}s ease ${i * 0.25}s infinite`,
            }}
          >
            {MUSIC_NOTES[i]}
          </div>
        ))}
      </div>

      <section
        className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center gap-5 px-6 py-8"
        style={{ background: VINYL_BG, overflow: "hidden" }}
      >
        <Spotlights />

        {/* Header */}
        <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "5px",
              color: "rgba(245,230,200,0.3)",
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              textTransform: "uppercase",
            }}
          >
            {subject}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "4px" }}>
            <EqBars color="#f59e0b" count={5} height={32} />
            <div
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
                letterSpacing: "4px",
                lineHeight: 1,
                background: "linear-gradient(135deg, #f59e0b, #fde68a, #f59e0b)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "goldShine 3s linear infinite",
              }}
            >
              HALL OF FAME
            </div>
            <EqBars color="#f59e0b" count={5} height={32} />
          </div>
        </div>

        {/* #1 featured card */}
        <div
          className="w-full"
          style={{
            position: "relative",
            zIndex: 2,
            opacity: apparition >= 3 ? 1 : 0,
            transform: apparition >= 3 ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.6s ease",
          }}
        >
          <div
            className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-10"
            style={{
              padding: "24px 32px",
              borderRadius: "16px",
              border: "2px solid rgba(245,158,11,0.3)",
              background: "rgba(245,158,11,0.06)",
              boxShadow: "0 0 40px rgba(245,158,11,0.15)",
            }}
          >
            <div
              style={{
                fontSize: "clamp(28px, 4vw, 40px)",
                animation: "crownFloat 2s ease infinite",
                flexShrink: 0,
              }}
            >
              👑
            </div>
            <BigVinyl size={130} color="#f59e0b" spinning label="1" />
            <div className="text-center md:text-left">
              <div
                style={{
                  fontSize: "11px",
                  letterSpacing: "4px",
                  color: "#f59e0b",
                  fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
                  marginBottom: "4px",
                }}
              >
                WINNAAR
              </div>
              <p
                className={clsx(
                  "overflow-visible whitespace-nowrap text-center text-3xl font-bold text-white drop-shadow-lg md:text-left md:text-5xl",
                  { "anim-balanced": apparition >= 4 },
                )}
              >
                {top[0].username}
              </p>
              <div
                style={{
                  fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
                  fontSize: "clamp(20px, 3vw, 28px)",
                  color: "#f59e0b",
                  letterSpacing: "2px",
                  textShadow: "0 0 30px rgba(245,158,11,0.6)",
                }}
              >
                {top[0].points.toLocaleString()} PTS
              </div>
            </div>
          </div>
        </div>

        {/* #2 and #3 grid */}
        {(top[1] || top[2]) && (
          <div
            className="grid w-full gap-3"
            style={{
              gridTemplateColumns: top[1] && top[2] ? "1fr 1fr" : "1fr",
              position: "relative",
              zIndex: 2,
            }}
          >
            {top[1] && (
              <div
                style={{
                  opacity: apparition >= 2 ? 1 : 0,
                  transform: apparition >= 2 ? "translateY(0)" : "translateY(40px)",
                  transition: "all 0.6s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  padding: "20px 16px",
                  borderRadius: "12px",
                  border: "2px solid rgba(148,163,184,0.25)",
                  background: "rgba(148,163,184,0.06)",
                }}
              >
                <BigVinyl size={100} color="#9ca3af" spinning={false} label="2" />
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "9px",
                      letterSpacing: "3px",
                      color: "#9ca3af",
                      fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
                      marginBottom: "2px",
                    }}
                  >
                    #2
                  </div>
                  <p
                    className={clsx(
                      "overflow-visible whitespace-nowrap text-center text-xl font-bold text-white md:text-2xl",
                      { "anim-balanced": apparition >= 4 },
                    )}
                  >
                    {top[1].username}
                  </p>
                  <div
                    style={{
                      fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
                      fontSize: "16px",
                      color: "#9ca3af",
                      letterSpacing: "2px",
                    }}
                  >
                    {top[1].points.toLocaleString()} PTS
                  </div>
                </div>
              </div>
            )}

            {top[2] && (
              <div
                style={{
                  opacity: apparition >= 1 ? 1 : 0,
                  transform: apparition >= 1 ? "translateY(0)" : "translateY(40px)",
                  transition: "all 0.6s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  padding: "20px 16px",
                  borderRadius: "12px",
                  border: "2px solid rgba(180,83,9,0.25)",
                  background: "rgba(180,83,9,0.06)",
                }}
              >
                <BigVinyl size={80} color="#cd7c2f" spinning={false} label="3" />
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "9px",
                      letterSpacing: "3px",
                      color: "#cd7c2f",
                      fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
                      marginBottom: "2px",
                    }}
                  >
                    #3
                  </div>
                  <p
                    className={clsx(
                      "overflow-visible whitespace-nowrap text-center text-xl font-bold text-white md:text-2xl",
                      { "anim-balanced": apparition >= 4 },
                    )}
                  >
                    {top[2].username}
                  </p>
                  <div
                    style={{
                      fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
                      fontSize: "16px",
                      color: "#cd7c2f",
                      letterSpacing: "2px",
                    }}
                  >
                    {top[2].points.toLocaleString()} PTS
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  )
}

export default Podium
