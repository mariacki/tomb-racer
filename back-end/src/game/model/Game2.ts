import { TileType, GameInfo, Event, Player } from "tr-common";
import { Movement } from "../contract";

class GameMetadata
{
    private id: string;
    private name: string;

    constructor(id: string, name: string)
    {
        this.id = id;
        this.name = name;
    }

    public info(): GameInfo
    {
        return {
            id: this.id,
            name: this.name
        }
    }
} 


interface Game
{
    addPlayer(userId: string): Event[];
    removePlayer(userId: string): Event[];
    handleStartRequest(userId: string): Event[];
    movePlayer(movement: Movement): Event[];
}