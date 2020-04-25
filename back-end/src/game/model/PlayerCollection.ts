import { Player } from "./Player";

interface PlayerItem
{
    player: Player,
    index: number
}

export class PlayerCollection
{
    private players: Player[] = [];
    private playersById: Map<string, PlayerItem> = new Map();

    push(player: Player)
    {
        const index = this.players.push(player) - 1;
        this.playersById.set(player.userId, {index, player});
    }

    removeHavingId(userId: string)
    {
        const playerItem = this.playersById.get(userId);
        
        this.playersById.delete(userId);
        this.players.splice(playerItem.index, 1);
    }

    getByUserId(userId: string): Player
    {
        return this.playersById.get(userId).player;
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
        return this.playersById.has(userId);
    }
}