import { Position, Event } from '../../../../common'; 
import { Board } from './Board';
import { TilePosition, Tile } from './tile';
import { InvalidPath } from '../errors';
import { Player } from './Player';
import { Game } from './Game';

export class Path
{
    private positions: TilePosition[];
    private board: Board;

    constructor(positions: Position[], board: Board, expectedLengh: number)
    {
        this.board = board;
        this.assertLength(positions.length, expectedLengh);
        this.setPositions(positions);
    }

    executeWalk(player: Player, game: Game): Event[]
    {
        if (!player.position.isAdjacentTo(this.first())) {
            throw new InvalidPath(
                [this.first()],
                "Some message"
            )
        }

        const events: Event[] = [];
        this.positions.forEach((pos) => {
            const tile = this.board.getTile(pos);
            events.push(...tile.onWalkThrough(player, game));
        })

        player.position = this.positions[this.positions.length - 1];
        events.push(...this.board.getTile(player.position).onPlaced(player, game));

        return events;
    }

    private first(): TilePosition
    {
        return this.positions[0];
    }

    private assertLength(positionsLength: number, expectedLengh: number)
    {
        if (positionsLength !== expectedLengh)
        {
            throw new InvalidPath([], "Path has invalid length");
        }
    }

    private setPositions(positions: Position[])
    {
        const tilePositions = this.toTilePositions(positions);
        this.assertValid(tilePositions);
        this.positions = tilePositions;
    }

    private toTilePositions(positions: Position[])
    {
        return positions
            .map((pos) => TilePosition.fromDto(pos));
    }

    private assertValid(positions: TilePosition[])
    {
        this.assertWalkable(positions);
        this.assertAdjacent(positions);
    }

    private assertWalkable(positions: TilePosition[])
    {
        const notWalkable = positions
            .filter((pos: TilePosition) => !this.board.isValid(pos));

        if (notWalkable.length) {
            throw new InvalidPath(
                notWalkable,
                "Path goes through walls"
            )
        }
    }   

    private assertAdjacent(pasitions: TilePosition[])
    {   
        for (let i = 1; i < pasitions.length; i++) {
            const prev = pasitions[i - 1];
            const current = pasitions[i];

            if (!current.isAdjacentTo(prev)) {
                throw new InvalidPath(
                    [prev, current],
                    "Path steps are not adjacent"
                )
            }
        }
    }
}