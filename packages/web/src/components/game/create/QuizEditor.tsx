import { Quizz, QuizzWithId } from "@rahoot/common/types/game"
import { useState } from "react"

type Question = Quizz["questions"][number]

type Props = {
  quiz: QuizzWithId | null
  onSave: (_id: string | undefined, _quiz: Quizz) => void
  onCancel: () => void
}

const emptyQuestion = (): Question => ({
  question: "",
  answers: ["", "", "", ""],
  solution: 0,
  cooldown: 5,
  time: 20,
})

const QuizEditor = ({ quiz, onSave, onCancel }: Props) => {
  const [subject, setSubject] = useState(quiz?.subject ?? "")
  const [questions, setQuestions] = useState<Question[]>(
    quiz?.questions ?? [emptyQuestion()],
  )

  const handleSave = () => {
    if (!subject.trim()) {
      alert("Vul een naam in voor de quiz")
      return
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim()) {
        alert(`Vraag ${i + 1} heeft geen tekst`)
        return
      }
      const filled = q.answers.filter((a) => a.trim())
      if (filled.length < 2) {
        alert(`Vraag ${i + 1} heeft minimaal 2 antwoorden nodig`)
        return
      }
    }
    const cleaned = questions.map((q) => ({
      ...q,
      answers: q.answers.filter((a) => a.trim()),
    }))
    onSave(quiz?.id, { subject, questions: cleaned })
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
    )
  }

  const updateAnswer = (qIndex: number, aIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q
        const answers = [...q.answers]
        answers[aIndex] = value
        return { ...q, answers }
      }),
    )
  }

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()])

  const removeQuestion = (index: number) =>
    setQuestions((prev) => prev.filter((_, i) => i !== index))

  return (
    <div className="z-10 flex w-full max-w-2xl flex-col gap-4 rounded-md bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {quiz ? "Quiz bewerken" : "Nieuwe quiz"}
        </h1>
        <button
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Terug
        </button>
      </div>

      <input
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-lg font-bold"
        placeholder="Naam van de quiz"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <div className="flex flex-col gap-6">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="rounded-md border border-gray-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-bold text-gray-600">
                Vraag {qIndex + 1}
              </span>
              {questions.length > 1 && (
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Verwijder vraag
                </button>
              )}
            </div>

            <input
              className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Vraagstelling"
              value={q.question}
              onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
            />

            <input
              className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Afbeelding URL (optioneel)"
              value={q.image ?? ""}
              onChange={(e) =>
                updateQuestion(qIndex, "image", e.target.value || undefined)
              }
            />

            <div className="mb-3 grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((aIndex) => (
                <div key={aIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`solution-${qIndex}`}
                    checked={q.solution === aIndex}
                    onChange={() => updateQuestion(qIndex, "solution", aIndex)}
                    className="accent-green-500"
                  />
                  <input
                    className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    placeholder={`Antwoord ${aIndex + 1}`}
                    value={q.answers[aIndex] ?? ""}
                    onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <p className="mb-3 text-xs text-gray-400">
              Selecteer het juiste antwoord met het rondje
            </p>

            <div className="flex gap-4">
              <label className="flex flex-col text-sm text-gray-600">
                Voorbereiding (sec)
                <input
                  type="number"
                  min={1}
                  max={30}
                  className="mt-1 w-20 rounded-md border border-gray-300 px-2 py-1"
                  value={q.cooldown}
                  onChange={(e) =>
                    updateQuestion(qIndex, "cooldown", Number(e.target.value))
                  }
                />
              </label>
              <label className="flex flex-col text-sm text-gray-600">
                Antwoordtijd (sec)
                <input
                  type="number"
                  min={5}
                  max={120}
                  className="mt-1 w-20 rounded-md border border-gray-300 px-2 py-1"
                  value={q.time}
                  onChange={(e) =>
                    updateQuestion(qIndex, "time", Number(e.target.value))
                  }
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addQuestion}
        className="rounded-md border-2 border-dashed border-gray-300 py-2 text-sm font-bold text-gray-500 hover:border-gray-400 hover:text-gray-700"
      >
        + Vraag toevoegen
      </button>

      <button
        onClick={handleSave}
        className="rounded-md bg-gray-800 py-3 text-base font-bold text-white hover:bg-gray-700"
      >
        Opslaan
      </button>
    </div>
  )
}

export default QuizEditor
