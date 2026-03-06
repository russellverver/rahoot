import clsx from "clsx"
import React from "react"

type Props = React.InputHTMLAttributes<HTMLInputElement>

const Input = ({ className, type = "text", ...otherProps }: Props) => (
  <input
    type={type}
    className={clsx(
      "rounded-xl border border-white/20 bg-white/10 p-3 text-lg font-semibold text-white placeholder-white/50 outline-none backdrop-blur-sm focus:border-white/40 focus:bg-white/15",
      className,
    )}
    {...otherProps}
  />
)

export default Input
