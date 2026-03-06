import clsx from "clsx"
import { ButtonHTMLAttributes, ElementType, PropsWithChildren, useState } from "react"

type Props = PropsWithChildren &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: ElementType
    colorIndex?: number
  }

const VINYL_COLORS = ["#f43f5e", "#8b5cf6", "#06b6d4", "#f59e0b"]
const SIDE_LABELS = ["A", "B", "C", "D"]

const AnswerButton = ({
  className,
  icon: Icon,
  children,
  colorIndex = 0,
  onClick,
  style,
  ...otherProps
}: Props) => {
  const [selected, setSelected] = useState(false)
  const color = VINYL_COLORS[colorIndex] ?? VINYL_COLORS[0]
  const label = SIDE_LABELS[colorIndex] ?? "A"

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelected(true)
    onClick?.(e)
  }

  return (
    <button
      className={clsx("overflow-hidden flex items-center text-left w-full", className)}
      style={{
        borderRadius: "8px",
        border: selected ? `2px solid ${color}` : `2px solid ${color}33`,
        background: "transparent",
        color: "#f5e6c8",
        boxShadow: selected ? `0 4px 24px ${color}55` : "none",
        animation: "answer-slide-in 0.4s ease backwards",
        animationDelay: `${colorIndex * 0.08}s`,
        transition: "all 0.25s",
        cursor: "pointer",
        ...style,
      }}
      onClick={handleClick}
      {...otherProps}
    >
      {/* Vinyl disc */}
      <div style={{
        width: "56px",
        height: "56px",
        flexShrink: 0,
        background: "conic-gradient(#1a0a00 0deg, #2a1000 30deg, #1a0800 60deg, #2a1200 90deg, #180800 120deg, #221000 180deg, #1a0a00 240deg, #2a1400 300deg, #1a0a00 360deg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: selected ? "vinyl-spin 3s linear infinite" : "none",
        position: "relative",
      }}>
        {/* Center label */}
        <div style={{
          width: "22px", height: "22px", borderRadius: "50%",
          background: selected ? color : "#3a1500",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "9px", fontWeight: 900,
          color: selected ? "white" : color,
          border: `1px solid ${color}55`,
          position: "relative", zIndex: 2,
          transition: "all 0.2s",
          fontFamily: "var(--font-bebas, monospace)",
        }}>{label}</div>
        {/* Groove rings */}
        {[16, 20, 24].map(r => (
          <div key={r} style={{
            position: "absolute",
            width: `${r}px`, height: `${r}px`,
            borderRadius: "50%",
            border: "0.5px solid rgba(255,150,50,0.1)",
            pointerEvents: "none",
          }} />
        ))}
      </div>

      {/* Text area */}
      <div style={{
        flex: 1, padding: "10px 14px",
        background: selected ? `${color}18` : "rgba(30,15,0,0.7)",
        transition: "background 0.2s",
      }}>
        <div style={{
          fontSize: "9px", letterSpacing: "3px",
          color: selected ? color : "rgba(245,230,200,0.3)",
          textTransform: "uppercase", marginBottom: "2px",
          fontFamily: "var(--font-bebas, monospace)",
        }}>Side {label}</div>
        <div style={{
          fontSize: "13px", fontWeight: 600,
          color: selected ? "#f5e6c8" : "rgba(245,230,200,0.7)",
          lineHeight: 1.3,
        }}>{children}</div>
      </div>

      {selected && (
        <div style={{ paddingRight: "14px", fontSize: "20px", color: "#f5e6c8" }}>▶</div>
      )}
    </button>
  )
}

export default AnswerButton
