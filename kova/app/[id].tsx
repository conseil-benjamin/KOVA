export default function Game({ params }: { params: { id: string } }) {
    return (
        <div>
            <h1>Game {params.id}</h1>
        </div>
    )
}