type GameActionProps = { onSubmit: () => void };

export default function GameActions({ onSubmit }: GameActionProps) {
    return (
        <div>
            <button onClick={onSubmit} >Submit</button>
        </div>
    )
}