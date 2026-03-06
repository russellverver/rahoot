type Props = {
  spinning?: boolean
  size?: number
  color?: string
}

const VinylRecord = ({ spinning = false, size = 160, color = "#f43f5e" }: Props) => {
  const labelSize = size * 0.38

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      flexShrink: 0,
      background: `conic-gradient(
        #1a0a00 0deg, #2a1200 15deg, #150800 30deg, #221000 50deg,
        #180800 70deg, #2a1400 90deg, #1a0a00 120deg, #221200 150deg,
        #150600 180deg, #2a1000 210deg, #1a0800 240deg, #221400 270deg,
        #180a00 300deg, #2a1200 330deg, #1a0a00 360deg
      )`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: spinning ? "vinyl-spin 3s linear infinite" : "float 4s ease infinite",
      position: "relative",
      boxShadow: `0 0 40px ${color}33, 0 20px 60px rgba(0,0,0,0.8)`,
    }}>
      {/* Groove rings */}
      {[0.85, 0.75, 0.65, 0.55, 0.45].map((r, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${size * r}px`,
          height: `${size * r}px`,
          borderRadius: "50%",
          border: "0.5px solid rgba(255,150,50,0.08)",
          pointerEvents: "none",
        }} />
      ))}

      {/* Center label */}
      <div style={{
        width: labelSize,
        height: labelSize,
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 35%, #2a2a2a, #111)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 20px ${color}66, inset 0 0 10px rgba(0,0,0,0.5)`,
        position: "relative",
        zIndex: 2,
        overflow: "hidden",
        border: `1.5px solid ${color}44`,
      }}>
        <img
          src="/logo.png"
          alt="Preston Palace"
          style={{
            width: "90%",
            height: "90%",
            objectFit: "contain",
            filter: `drop-shadow(0 0 4px ${color}88)`,
          }}
        />
        {/* Center hole */}
        <div style={{
          position: "absolute",
          width: size * 0.04,
          height: size * 0.04,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.8)",
          border: "1px solid rgba(255,255,255,0.1)",
        }} />
      </div>

      {/* Shine overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.06), transparent 60%)",
        pointerEvents: "none",
      }} />
    </div>
  )
}

export default VinylRecord
