type GameActionProps = { numCheckedWords: number, onSubmit: () => void };

export default function GameActions({ numCheckedWords, onSubmit }: GameActionProps) {
    return (
        <div>
            <button disabled={numCheckedWords != 2} onClick={onSubmit} >Submit</button>
        </div>
    )
}