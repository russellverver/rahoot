"use client"

import { PlayerStatusDataMap } from "@rahoot/common/types/game/status"
import VinylRecord from "@rahoot/web/components/VinylRecord"
import { usePlayerStore } from "@rahoot/web/stores/player"

type Props = {
  data: PlayerStatusDataMap["WAIT"]
}

const VINYL_BG = "linear-gradient(160deg, #0d0520 0%, #1a0a35 50%, #05101a 100%)"

const Wait = ({ data: { text } }: Props) => {
  const { player } = usePlayerStore()
  const username = player?.username ?? text

  return (
    <section
      className="relative mx-auto flex w-full flex-1 flex-col items-center justify-center gap-7 px-5 py-10 md:flex-row md:justify-center md:gap-24 md:px-20 md:py-16"
      style={{ background: VINYL_BG, animation: "slideUp 0.5s ease" }}
    >
      {/* Vinyl with pulse rings */}
      <div className="flex-shrink-0">
        {/* Mobile: size 130, rings 170px */}
        <div className="relative flex items-center justify-center md:hidden">
          {[0, 1].map(i => (
            <div key={i} style={{
              position: "absolute",
              width: "170px", height: "170px",
              borderRadius: "50%",
              border: "1.5px solid rgba(6,182,212,0.3)",
              animation: "pulse-ring 2s ease infinite",
              animationDelay: `${i * 0.6}s`,
            }} />
          ))}
          <VinylRecord size={130} color="#06b6d4" spinning />
        </div>
        {/* Desktop: size 260, rings 330px */}
        <div className="relative hidden items-center justify-center md:flex">
          {[0, 1].map(i => (
            <div key={i} style={{
              position: "absolute",
              width: "330px", height: "330px",
              borderRadius: "50%",
              border: "1.5px solid rgba(6,182,212,0.2)",
              animation: "pulse-ring 2s ease infinite",
              animationDelay: `${i * 0.6}s`,
            }} />
          ))}
          <VinylRecord size={260} color="#06b6d4" spinning />
        </div>
      </div>

      {/* Text + player card */}
      <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
        {/* Mobile title: single line */}
        <div className="md:hidden" style={{
          fontSize: "24px",
          fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
          letterSpacing: "3px",
          color: "#f5e6c8",
        }}>WACHTEN OP DE HOST</div>

        {/* Desktop title: two lines, second in cyan */}
        <div className="hidden md:block">
          <div style={{ fontSize: "52px", fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)", letterSpacing: "4px", color: "#f5e6c8", lineHeight: 1 }}>WACHTEN OP</div>
          <div style={{ fontSize: "52px", fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)", letterSpacing: "4px", color: "#06b6d4", lineHeight: 1 }}>DE HOST</div>
        </div>

        {/* Animated dots */}
        <div className="flex gap-[6px] md:gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="h-[7px] w-[7px] rounded-full md:h-[10px] md:w-[10px]"
              style={{
                background: "#06b6d4",
                animation: "dots 1.4s ease infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Player card */}
        <div
          className="flex w-full min-w-[260px] items-center gap-4 rounded-[12px] px-[18px] py-[14px] md:min-w-[320px] md:rounded-[16px] md:gap-[18px] md:px-6 md:py-5"
          style={{
            border: "2px solid #06b6d4",
            background: "rgba(6,182,212,0.08)",
            boxShadow: "0 0 20px rgba(6,182,212,0.15)",
          }}
        >
          {/* Avatar */}
          <div
            className="h-[42px] w-[42px] flex-shrink-0 text-[20px] md:h-[56px] md:w-[56px] md:text-[26px]"
            style={{
              borderRadius: "50%",
              background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
              color: "white",
            }}
          >{(username[0] ?? "?").toUpperCase()}</div>

          <div>
            <div style={{
              fontSize: "10px",
              letterSpacing: "3px",
              color: "rgba(245,230,200,0.4)",
              textTransform: "uppercase",
              fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
            }}>Ingelogd als</div>
            <div
              className="text-[18px] md:text-[22px]"
              style={{
                fontWeight: 700,
                color: "#f5e6c8",
                fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
              }}
            >{username}</div>
          </div>

          <div style={{
            marginLeft: "auto",
            fontSize: "13px",
            color: "#06b6d4",
            fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
            letterSpacing: "1px",
          }}>KLAAR ✓</div>
        </div>
      </div>
    </section>
  )
}

export default Wait
