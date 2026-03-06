"use client"

import { ChangeEvent, KeyboardEvent, useRef } from "react"

const PIN_LENGTH = 6

type Props = {
  value: string
  onChange: (val: string) => void
  onEnter?: () => void
}

const PinInput = ({ value, onChange, onEnter }: Props) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const digits = value.split("").concat(Array(PIN_LENGTH).fill("")).slice(0, PIN_LENGTH)

  const handleChange = (i: number, e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1)
    const newDigits = [...digits]
    newDigits[i] = val
    const newPin = newDigits.join("").replace(/ /g, "")
    onChange(newPin)
    if (val && i < PIN_LENGTH - 1) {
      inputRefs.current[i + 1]?.focus()
    }
  }

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onEnter?.()
      return
    }
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
      const newDigits = [...digits]
      newDigits[i - 1] = ""
      onChange(newDigits.join("").replace(/ /g, ""))
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, PIN_LENGTH)
    onChange(pasted)
    inputRefs.current[Math.min(pasted.length, PIN_LENGTH - 1)]?.focus()
    e.preventDefault()
  }

  return (
    <div className="flex justify-center gap-2 md:gap-3">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => { inputRefs.current[i] = el }}
          value={d}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          maxLength={1}
          inputMode="numeric"
          className="h-[56px] w-[44px] rounded-[10px] text-[26px] md:h-[80px] md:w-[64px] md:rounded-[14px] md:text-[36px]"
          style={{
            border: d ? "2px solid #f43f5e" : "2px solid rgba(255,200,100,0.2)",
            background: d ? "rgba(244,63,94,0.12)" : "rgba(30,15,0,0.7)",
            backdropFilter: "blur(10px)",
            color: "#f5e6c8",
            fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
            textAlign: "center",
            outline: "none",
            transition: "all 0.15s",
            boxShadow: d ? "0 0 16px rgba(244,63,94,0.35)" : "none",
            animation: d ? "boxPop 0.15s ease" : "none",
            caretColor: "transparent",
          }}
        />
      ))}
    </div>
  )
}

export default PinInput
