"use client"

import { Status } from "@rahoot/common/types/game/status"
import Button from "@rahoot/web/components/Button"
import Loader from "@rahoot/web/components/Loader"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { useQuestionStore } from "@rahoot/web/stores/question"
import { MANAGER_SKIP_BTN } from "@rahoot/web/utils/constants"
import clsx from "clsx"
import { PropsWithChildren, useEffect, useState } from "react"

type Props = PropsWithChildren & {
  statusName: Status | undefined
  onNext?: () => void
  manager?: boolean
}

const GameWrapper = ({ children, statusName, onNext, manager }: Props) => {
  const { isConnected } = useSocket()
  const { player } = usePlayerStore()
  const { questionStates, setQuestionStates } = useQuestionStore()
  const [isDisabled, setIsDisabled] = useState(false)
  const next = statusName ? MANAGER_SKIP_BTN[statusName] : null

  useEffect(() => {
    setIsDisabled(false)
  }, [statusName])

  const handleNext = () => {
    setIsDisabled(true)
    onNext?.()
  }

  useEvent("game:updateQuestion", ({ current, total }) => {
    setQuestionStates({
      current,
      total,
    })
  })

  return (
    <section className="relative flex min-h-dvh w-full flex-col justify-between">
      <div className="fixed top-0 left-0 -z-10 h-full w-full">
        {manager ? (
          <video
            className="pointer-events-none h-full w-full object-cover"
            src="/background.mov"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <div
            className="pointer-events-none h-full w-full"
            style={{ background: "linear-gradient(135deg, #1a1a3e 0%, #2d1b69 50%, #0f3460 100%)" }}
          />
        )}
      </div>

      {!isConnected && !statusName ? (
        <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
          <Loader />
          <h1 className="text-4xl font-bold text-white">Connecting...</h1>
        </div>
      ) : (
        <>
          {manager && next && (
            <div className="flex w-full justify-end p-4">
              <Button
                className={clsx("bg-white px-4 text-black!", {
                  "pointer-events-none": isDisabled,
                })}
                onClick={handleNext}
              >
                {next}
              </Button>
            </div>
          )}
          {children}

          {!manager && player && (
            <div
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                background: "rgba(10, 5, 30, 0.75)",
                backdropFilter: "blur(12px)",
                borderTop: "1px solid rgba(139, 92, 246, 0.25)",
                gap: "12px",
              }}
            >
              {/* Naam */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#4ade80",
                    boxShadow: "0 0 8px #4ade80",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
                    fontSize: "18px",
                    letterSpacing: "2px",
                    color: "rgba(245, 230, 200, 0.9)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {player.username}
                </span>
              </div>

              {/* Vraagnummer */}
              {questionStates && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
                      fontSize: "13px",
                      letterSpacing: "2px",
                      color: "rgba(139, 92, 246, 0.7)",
                    }}
                  >
                    VRAAG
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
                      fontSize: "20px",
                      color: "white",
                      lineHeight: 1,
                    }}
                  >
                    {questionStates.current}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    / {questionStates.total}
                  </span>
                </div>
              )}

              {/* Punten */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  flexShrink: 0,
                  padding: "4px 12px",
                  borderRadius: "999px",
                  background: "rgba(139, 92, 246, 0.15)",
                  border: "1px solid rgba(139, 92, 246, 0.35)",
                  boxShadow: "0 0 12px rgba(139, 92, 246, 0.2)",
                }}
              >
                <span style={{ fontSize: "14px" }}>⭐</span>
                <span
                  style={{
                    fontFamily: "var(--font-bebas, 'Bebas Neue', monospace)",
                    fontSize: "20px",
                    color: "white",
                    letterSpacing: "1px",
                    lineHeight: 1,
                  }}
                >
                  {player.points}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default GameWrapper
