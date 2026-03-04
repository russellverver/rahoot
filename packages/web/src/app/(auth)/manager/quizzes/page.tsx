"use client"

import { Quizz, QuizzWithId } from "@rahoot/common/types/game"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import ManagerPassword from "@rahoot/web/components/game/create/ManagerPassword"
import QuizList from "@rahoot/web/components/game/create/QuizList"
import QuizEditor from "@rahoot/web/components/game/create/QuizEditor"

type View = "list" | "edit"

const QuizzesPage = () => {
  const { socket } = useSocket()
  const [isAuth, setIsAuth] = useState(false)
  const [quizzes, setQuizzes] = useState<QuizzWithId[]>([])
  const [view, setView] = useState<View>("list")
  const [editingQuiz, setEditingQuiz] = useState<QuizzWithId | null>(null)

  useEvent("manager:quizzList", (list) => {
    setIsAuth(true)
    setQuizzes(list)
  })

  useEvent("manager:quizzSaved", (quiz) => {
    setQuizzes((prev) => {
      const exists = prev.find((q) => q.id === quiz.id)
      if (exists) return prev.map((q) => (q.id === quiz.id ? quiz : q))
      return [...prev, quiz]
    })
    toast.success("Quiz opgeslagen!")
    setView("list")
  })

  useEvent("manager:quizzDeleted", (id) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id))
    toast.success("Quiz verwijderd")
  })

  useEvent("manager:errorMessage", (msg) => toast.error(msg))

  useEffect(() => {
    if (isAuth) {
      socket?.emit("manager:getQlabConfig")
    }
  }, [isAuth, socket])

  const handleAuth = (password: string) => {
    socket?.emit("manager:auth", password)
  }

  const handleEdit = (quiz: QuizzWithId) => {
    setEditingQuiz(quiz)
    setView("edit")
  }

  const handleNew = () => {
    setEditingQuiz(null)
    setView("edit")
  }

  const handleSave = (id: string | undefined, quiz: Quizz) => {
    socket?.emit("manager:saveQuizz", { id, quiz })
  }

  const handleDelete = (id: string) => {
    socket?.emit("manager:deleteQuizz", id)
  }

  if (!isAuth) {
    return <ManagerPassword onSubmit={handleAuth} />
  }

  if (view === "edit") {
    return (
      <QuizEditor
        quiz={editingQuiz}
        onSave={handleSave}
        onCancel={() => setView("list")}
      />
    )
  }

  return (
    <QuizList
      quizzes={quizzes}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onNew={handleNew}
    />
  )
}

export default QuizzesPage
