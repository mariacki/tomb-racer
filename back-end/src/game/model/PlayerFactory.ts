import { PlayerData } from "..";
import { Player } from "./Player";
import { TilePosition } from "./tile";

export class PlayerFactory
{
    static create(playerData: PlayerData, position: TilePosition): Player
    {
        return new Player(
            playerData.userId,
            playerData.userName,
            position
        )
    }
}