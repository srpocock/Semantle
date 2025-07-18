type GameStatusProps = { attemptsLeft: number };

export default function GameStatus( {attemptsLeft}: GameStatusProps) {
    return (
        <>
            <div>Attempts remaining: {attemptsLeft}</div>
        </>
    )
}