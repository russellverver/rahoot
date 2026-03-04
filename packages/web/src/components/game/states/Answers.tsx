"use client"

import { CommonStatusDataMap } from "@rahoot/common/types/game/status"
import AnswerButton from "@rahoot/web/components/AnswerButton"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import {
  ANSWERS_COLORS,
  ANSWERS_ICONS,
  SFX_ANSWERS_MUSIC,
  SFX_ANSWERS_SOUND,
} from "@rahoot/web/utils/constants"
import clsx from "clsx"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import useSound from "use-sound"

const ANSWER_IMAGES = ["/antwoord-a.png", "/antwoord-b.png", "/antwoord-c.png", "/antwoord-d.png"]

type Props = {
  data: CommonStatusDataMap["SELECT_ANSWER"]
  manager?: boolean
}

const Answers = ({
  data: { question, answers, image, audio, video, time, totalPlayer },
  manager,
}: Props) => {
  const { gameId }: { gameId?: string } = useParams()
  const { socket } = useSocket()
  const { player } = usePlayerStore()

  const [cooldown, setCooldown] = useState(time)
  const [totalAnswer, setTotalAnswer] = useState(0)

  const [sfxPop] = useSound(SFX_ANSWERS_SOUND, {
    volume: 0.1,
  })

  const [playMusic, { stop: stopMusic }] = useSound(SFX_ANSWERS_MUSIC, {
    volume: 0.2,
    interrupt: true,
    loop: true,
  })

  const handleAnswer = (answerKey: number) => () => {
    if (!player) {
      return
    }

    socket?.emit("player:selectedAnswer", {
      gameId,
      data: {
        answerKey,
      },
    })
    sfxPop()
  }

  useEffect(() => {
    if (video || audio) {
      return
    }

    playMusic()

    // eslint-disable-next-line consistent-return
    return () => {
      stopMusic()
    }
  }, [playMusic])

  useEvent("game:cooldown", (sec) => {
    setCooldown(sec)
  })

  useEvent("game:playerAnswer", (count) => {
    setTotalAnswer(count)
    sfxPop()
  })

  if (!manager) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-3 pb-2">
        {/* Vraag box */}
        <div className="relative flex-shrink-0">
          <img src="/vraag-box.png" alt="" className="w-full" draggable={false} />
          <div className="absolute inset-0 flex items-center justify-center px-10 pt-3">
            <p
              className="text-center text-sm font-bold text-white drop-shadow-lg sm:text-base"
              style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
            >
              {question}
            </p>
          </div>
        </div>

        {/* Tijd / antwoorden teller */}
        <div className="flex flex-shrink-0 justify-between px-1 text-sm font-bold text-white">
          <div className="flex items-center gap-1 rounded-full bg-black/40 px-3 py-1">
            <span>⏱ {cooldown}s</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-black/40 px-3 py-1">
            <span>{totalAnswer}/{totalPlayer} antwoorden</span>
          </div>
        </div>

        {/* 2×2 antwoord grid */}
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-2" style={{ gridTemplateRows: "1fr 1fr" }}>
          {answers.map((answer, key) => (
            <button
              key={key}
              onClick={handleAnswer(key)}
              className="relative h-full w-full"
            >
              <img src={ANSWER_IMAGES[key]} alt="" className="h-full w-full object-contain" draggable={false} />
              <span
                className="absolute right-2 left-[28%] top-1/2 -translate-y-1/2 text-center text-xs font-bold text-white drop-shadow-lg sm:text-sm"
                style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
              >
                {answer}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-1 flex-col justify-between">
      <div className="mx-auto inline-flex h-full w-full max-w-7xl flex-1 flex-col items-center justify-center gap-5">
        <h2 className="text-center text-2xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
          {question}
        </h2>

        {Boolean(audio) && !player && (
          <audio className="m-4 mb-2 w-auto rounded-md" src={audio} autoPlay controls />
        )}

        {Boolean(video) && !player && (
          <video className="m-4 mb-2 aspect-video max-h-60 w-auto rounded-md px-4 sm:max-h-100" src={video} autoPlay controls />
        )}

        {Boolean(image) && (
          <img alt={question} src={image} className="mb-2 max-h-60 w-auto rounded-md px-4 sm:max-h-100" />
        )}
      </div>

      <div>
        <div className="mx-auto mb-4 flex w-full max-w-7xl justify-between gap-1 px-2 text-lg font-bold text-white md:text-xl">
          <div className="flex flex-col items-center rounded-full bg-black/40 px-4 text-lg font-bold">
            <span className="translate-y-1 text-sm">Time</span>
            <span>{cooldown}</span>
          </div>
          <div className="flex flex-col items-center rounded-full bg-black/40 px-4 text-lg font-bold">
            <span className="translate-y-1 text-sm">Answers</span>
            <span>{totalAnswer}/{totalPlayer}</span>
          </div>
        </div>

        <div className="mx-auto mb-4 grid w-full max-w-7xl grid-cols-2 gap-1 rounded-full px-2 text-lg font-bold text-white md:text-xl">
          {answers.map((answer, key) => (
            <AnswerButton
              key={key}
              className={clsx(ANSWERS_COLORS[key])}
              icon={ANSWERS_ICONS[key]}
              onClick={handleAnswer(key)}
            >
              {answer}
            </AnswerButton>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Answers
