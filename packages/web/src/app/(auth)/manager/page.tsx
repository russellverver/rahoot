"use client"

import { QuizzWithId } from "@rahoot/common/types/game"
import { STATUS } from "@rahoot/common/types/game/status"
import ManagerPassword from "@rahoot/web/components/game/create/ManagerPassword"
import SelectQuizz from "@rahoot/web/components/game/create/SelectQuizz"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { useManagerStore } from "@rahoot/web/stores/manager"
import { useRouter } from "next/navigation"
import { useState } from "react"

const Manager = () => {
  const { setGameId, setStatus } = useManagerStore()
  const router = useRouter()
  const { socket } = useSocket()

  const [isAuth, setIsAuth] = useState(false)
  const [quizzList, setQuizzList] = useState<QuizzWithId[]>([])
  const [qlabConfig, setQlabConfig] = useState<{ ip: string; port: number } | null>(null)

  useEvent("manager:quizzList", (quizzList) => {
    setIsAuth(true)
    setQuizzList(quizzList)
    socket?.emit("manager:getQlabConfig")
  })

  useEvent("manager:qlabConfig", (config) => {
    setQlabConfig(config)
  })

  useEvent("manager:gameCreated", ({ gameId, inviteCode }) => {
    setGameId(gameId)
    setStatus(STATUS.SHOW_ROOM, { text: "Waiting for the players", inviteCode })
    router.push(`/game/manager/${gameId}`)
  })

  const handleAuth = (password: string) => {
    socket?.emit("manager:auth", password)
  }

  const handleCreate = (quizzId: string) => {
    socket?.emit("game:create", quizzId)
  }

  const handleSaveQlab = (ip: string, port: number) => {
    socket?.emit("manager:setQlabConfig", { ip, port })
  }

  if (!isAuth) {
    return <ManagerPassword onSubmit={handleAuth} />
  }

  return (
    <SelectQuizz
      quizzList={quizzList}
      onSelect={handleCreate}
      qlabConfig={qlabConfig}
      onSaveQlab={handleSaveQlab}
    />
  )
}

export default Manager
