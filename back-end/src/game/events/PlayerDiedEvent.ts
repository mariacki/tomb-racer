import { PlayerDied, EventType, Position } from "../../../../common";
import { Player } from "../model";

export class PlayerDiedEvent implements PlayerDied
{
    isError: boolean = false;
    type: EventType = EventType.PLAYER_DIED;
    origin: string;

    userId: string;
    movedTo: Position;
    hp: number;

    constructor(gameId: string, player: Player) {
        this.origin = gameId;
        this.userId = player.userId;
        this.movedTo = player.position;
        this.hp = player.hp;
    }
}