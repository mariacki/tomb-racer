import { Player } from "./Player";

export class PlayerCollection
{
    private players: Player[] = [];
    push(player: Player)
    {
        this.players.push(player) - 1;
    }

    removeHavingId(userId: string)
    {
        this.players = this.players
            .filter((player) => player.userId !== userId);
    }

    getByUserId(userId: string): Player
    {
        return this.players
            .filter(player => player.userId === userId)[0];
    }

    getByIndex(index: number)
    {
        return this.players[index];
    }

    size(): number
    {
        return this.players.length;
    }

    getAll(): Player[]
    {
        return this.players;
    }

    has(userId: string)
    {
        return this.players
            .filter(player => player.userId === userId)
            .length >= 1;
    }
}