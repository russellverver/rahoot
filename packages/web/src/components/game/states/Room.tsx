"use client"

import { Player } from "@rahoot/common/types/game"
import { ManagerStatusDataMap } from "@rahoot/common/types/game/status"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { useManagerStore } from "@rahoot/web/stores/manager"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import Link from "next/link"

type Props = {
  data: ManagerStatusDataMap["SHOW_ROOM"]
}

const Room = ({ data: { text, inviteCode: initialInviteCode } }: Props) => {
  const { gameId } = useManagerStore()
  const { socket, webUrl } = useSocket()
  const { players } = useManagerStore()
  const [playerList, setPlayerList] = useState<Player[]>(players)
  const [totalPlayers, setTotalPlayers] = useState(0)
  const [inviteCode, setInviteCode] = useState(initialInviteCode)
  const [secondsLeft, setSecondsLeft] = useState(30)

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 30 : s - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEvent("manager:newPlayer", (player) => {
    setPlayerList([...playerList, player])
  })

  useEvent("manager:removePlayer", (playerId) => {
    setPlayerList(playerList.filter((p) => p.id !== playerId))
  })

  useEvent("manager:playerKicked", (playerId) => {
    setPlayerList(playerList.filter((p) => p.id !== playerId))
  })

  useEvent("game:totalPlayers", (total) => {
    setTotalPlayers(total)
  })

  useEvent("manager:inviteCodeUpdate", ({ code, expiresAt }) => {
    setInviteCode(code)
    setSecondsLeft(Math.round((expiresAt - Date.now()) / 1000))
  })

  const handleKick = (playerId: string) => () => {
    if (!gameId) {
      return
    }

    socket?.emit("manager:kickPlayer", {
      gameId,
      playerId,
    })
  }

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-2">
      <div className="mb-10 flex flex-col-reverse items-center gap-3 md:flex-row md:items-stretch">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="game-pin-out flex flex-col justify-center rounded-md bg-white px-6 py-4">
            <p className="text-2xl font-bold">Join the game at</p>
            <p className="w-60 text-lg font-extrabold break-all">{webUrl}</p>
          </div>

          <div className="game-pin-in flex flex-col justify-center rounded-md bg-white px-6 py-4 text-center md:rounded-l-none md:text-left">
            <p className="text-2xl font-bold">Game PIN:</p>
            <p className="text-6xl font-extrabold">{inviteCode}</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-1000"
                style={{ width: `${(secondsLeft / 30) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Nieuwe PIN over {secondsLeft}s
            </p>
          </div>
        </div>

        <div className="flex h-40 shrink-0 rounded-md bg-white p-2">
          <QRCode
            className="h-auto w-auto"
            value={`${webUrl}?pin=${inviteCode}`}
          />
        </div>
      </div>

      <h2 className="mb-4 text-4xl font-bold text-white drop-shadow-lg">
        {text}
      </h2>

      <div className="mb-6 flex items-center justify-center rounded-full bg-black/40 px-6 py-3">
        <span className="text-2xl font-bold text-white drop-shadow-md">
          Players Joined: {totalPlayers}
        </span>
      </div>

      <Link
        href={`/spectator?pin=${inviteCode}`}
        target="_blank"
        className="mb-4 rounded-md bg-amber-500 px-5 py-2 text-lg font-bold text-white shadow hover:bg-amber-400"
      >
        Open leaderboard scherm
      </Link>

      <div className="flex flex-wrap gap-3">
        {playerList.map((player) => (
          <div
            key={player.id}
            className="shadow-inset bg-primary rounded-md px-4 py-3 font-bold text-white"
            onClick={handleKick(player.id)}
          >
            <span className="cursor-pointer text-3xl drop-shadow-md hover:line-through">
              {player.username}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Room
