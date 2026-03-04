import { QuizzWithId } from "@rahoot/common/types/game"
import Button from "@rahoot/web/components/Button"
import clsx from "clsx"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

type Props = {
  quizzList: QuizzWithId[]
  onSelect: (_id: string) => void
  qlabConfig: { ip: string; port: number } | null
  onSaveQlab: (_ip: string, _port: number) => void
}

const SelectQuizz = ({ quizzList, onSelect, qlabConfig, onSaveQlab }: Props) => {
  const [selected, setSelected] = useState<string | null>(null)
  const [qlabIp, setQlabIp] = useState("127.0.0.1")
  const [qlabPort, setQlabPort] = useState("53000")
  const [qlabSaved, setQlabSaved] = useState(false)

  useEffect(() => {
    if (qlabConfig) {
      setQlabIp(qlabConfig.ip)
      setQlabPort(String(qlabConfig.port))
    }
  }, [qlabConfig])

  const handleSelect = (id: string) => () => {
    if (selected === id) {
      setSelected(null)
    } else {
      setSelected(id)
    }
  }

  const handleSubmit = () => {
    if (!selected) {
      toast.error("Please select a quizz")
      return
    }
    onSelect(selected)
  }

  const handleSaveQlab = () => {
    const port = parseInt(qlabPort)
    if (!qlabIp || isNaN(port)) {
      toast.error("Invalid QLab settings")
      return
    }
    onSaveQlab(qlabIp, port)
    setQlabSaved(true)
    setTimeout(() => setQlabSaved(false), 2000)
  }

  return (
    <div className="z-10 flex w-full max-w-md flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-2 text-2xl font-bold">Select a quizz</h1>
        <div className="w-full space-y-2">
          {quizzList.map((quizz) => (
            <button
              key={quizz.id}
              className={clsx(
                "flex w-full items-center justify-between rounded-md p-3 outline outline-gray-300",
              )}
              onClick={handleSelect(quizz.id)}
            >
              {quizz.subject}
              <div
                className={clsx(
                  "h-5 w-5 rounded outline outline-offset-3 outline-gray-300",
                  selected === quizz.id &&
                    "bg-primary border-primary/80 shadow-inset",
                )}
              ></div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h2 className="mb-2 text-sm font-bold text-gray-600">QLab instellingen</h2>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="IP-adres"
            value={qlabIp}
            onChange={(e) => setQlabIp(e.target.value)}
          />
          <input
            className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Poort"
            value={qlabPort}
            onChange={(e) => setQlabPort(e.target.value)}
          />
          <button
            className={clsx(
              "rounded-md px-3 py-2 text-sm font-bold text-white transition-colors",
              qlabSaved ? "bg-green-500" : "bg-gray-800 hover:bg-gray-700",
            )}
            onClick={handleSaveQlab}
          >
            {qlabSaved ? "Opgeslagen!" : "Opslaan"}
          </button>
        </div>
      </div>

      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  )
}

export default SelectQuizz
