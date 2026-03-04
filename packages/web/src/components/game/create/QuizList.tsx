import { QuizzWithId } from "@rahoot/common/types/game"

type Props = {
  quizzes: QuizzWithId[]
  onEdit: (_quiz: QuizzWithId) => void
  onDelete: (_id: string) => void
  onNew: () => void
}

const QuizList = ({ quizzes, onEdit, onDelete, onNew }: Props) => {
  const handleDelete = (quiz: QuizzWithId) => {
    if (confirm(`"${quiz.subject}" verwijderen?`)) {
      onDelete(quiz.id)
    }
  }

  return (
    <div className="z-10 flex w-full max-w-xl flex-col gap-4 rounded-md bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quizzen</h1>
        <button
          onClick={onNew}
          className="rounded-md bg-gray-800 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700"
        >
          + Nieuwe quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <p className="text-center text-gray-500">Nog geen quizzen. Maak er een aan!</p>
      ) : (
        <div className="flex flex-col gap-2">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3"
            >
              <div>
                <p className="font-bold">{quiz.subject}</p>
                <p className="text-sm text-gray-500">
                  {quiz.questions.length} vragen
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(quiz)}
                  className="rounded-md bg-gray-100 px-3 py-1 text-sm font-bold hover:bg-gray-200"
                >
                  Bewerken
                </button>
                <button
                  onClick={() => handleDelete(quiz)}
                  className="rounded-md bg-red-100 px-3 py-1 text-sm font-bold text-red-600 hover:bg-red-200"
                >
                  Verwijderen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuizList
