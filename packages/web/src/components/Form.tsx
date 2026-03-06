import { PropsWithChildren } from "react"

const Form = ({ children }: PropsWithChildren) => (
  <div
    className="z-10 flex w-full max-w-80 flex-col gap-4 rounded-2xl border border-white/15 p-6"
    style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}
  >
    {children}
  </div>
)

export default Form
