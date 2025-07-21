// WordState enum
const WordState = {
    Untested: "untested",
    Incorrect: "incorrect",
    Correct: "correct",
    Flipped: "flipped"
} as const
type WordStateType = typeof WordState[keyof typeof WordState];

type WordStatesType = {
    [word: string]: WordStateType;
}

export { WordState, type WordStateType, type WordStatesType };