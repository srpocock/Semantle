type GameStatusProps = { attemptsLeft: number };

export default function GameStatus( {attemptsLeft}: GameStatusProps) {
    return (
        <>
            <div>Guess which two words are semantically most closely related!</div>
            <div>Attempts remaining: {attemptsLeft}</div>
        </>
    )
}