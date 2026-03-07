import { STATUS } from "@rahoot/common/types/game/status"

export * from "@rahoot/web/utils/answers"

export const GAME_STATES = {
  status: {
    name: STATUS.WAIT,
    data: { text: "Waiting for the players" },
  },
  question: {
    current: 1,
    total: null,
  },
}

export * from "@rahoot/web/utils/componentMap"

export * from "@rahoot/web/utils/sfx"

export const MANAGER_SKIP_BTN = {
  [STATUS.SHOW_ROOM]: "Start Game",
  [STATUS.SHOW_START]: null,
  [STATUS.SHOW_PREPARED]: null,
  [STATUS.SHOW_QUESTION]: null,
  [STATUS.SELECT_ANSWER]: "Skip",
  [STATUS.SHOW_RESULT]: null,
  [STATUS.SHOW_RESPONSES]: "Next",
  [STATUS.SHOW_LEADERBOARD]: "Next",
  [STATUS.FINISHED]: null,
  [STATUS.WAIT]: null,
}
