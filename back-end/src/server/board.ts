import { Tiles, Tile, TilePosition } from '../game';
import { Player, Game } from '../game/model';
import { Event, TileType, EventType, Position, ItemPicked } from '../../../common';
import { PlayerDiedEvent } from '../game/events';
import rnd from '../rnd';

function createNOfType(n: number, type: Function)
{
    const result = [];

    for (let i = 0; i < n; i++)
    {
        result.push(type())
    }

    return result;
}

interface BoardChanged extends Event
{
    position: Position,
    tileType: TileType.PATH
}

class KeyHole extends Tile
{
    public opens: Position
    public keyName: string;

    isWalkable()
    {
        return true;
    }

    onPlaced(player: Player, game: Game): Event[]
    {
        console.debug("Player inventory", player.inventory);
        console.debug("I open when", this.keyName);
        if (player.inventory.includes(this.keyName))
        {
            game.board.tiles[this.opens.row][this.opens.col] = Tiles.path()(this.opens.row, this.opens.col);
            
            const doorOpened: BoardChanged = {
                type: EventType.BOARD_CHANGED,
                isError: false,
                origin: game.id,
                position: this.opens,
                tileType: TileType.PATH
            }

            const others = game.players.getAll().filter((p) => p.userId != p.userId);
            others.forEach(p => p.position = p.startedOn);
            const deathEvents = others.map((p) => new PlayerDiedEvent(game.id, p));

            return [doorOpened, ...deathEvents];
        } else {
            return [];
        }
    }
}

class KillRandom extends Tile
{
    onPlaced(player: Player, game: Game): Event[]
    {   
        const events: Event[] = [];

        const others = game.players.getAll().filter((p) => p.userId != player.userId);
        
        if (!others.length) {
            return [];
        }
        
        const random = rnd(0, others.length);
        console.log(random);
        const target = others[random];
        target.hp -= 5;
        target.position = target.startedOn;

        return others.map((p) => new PlayerDiedEvent(game.id, target));
    }
}

class Key extends Tile
{
    public holds: string;
    public player: TilePosition;

    isWalkable(): boolean
    {
        return true;
    }

    onWalkThrough(player: Player, game: Game): Event[]
    {
        player.inventory.push(this.holds);
        game.board.tiles[this.position.row][this.position.col] = new Tile(TileType.PATH, this.position);


        if (!player.startedOn.equals(this.player))
        {
            return [];
        }

        const doorOpened: BoardChanged = {
            type: EventType.BOARD_CHANGED,
            isError: false,
            origin: game.id,
            position: this.position,
            tileType: TileType.PATH
        }

        const itemPicked: ItemPicked = {
            type: EventType.ITEM_PICKED,
            isError: false,
            origin: game.id,
            item: this.holds
        }

        return [doorOpened, itemPicked];
    }
}


const board = [
    createNOfType(17, Tiles.wall),
    [Tiles.wall(), Tiles.path(), Tiles.startingPoint(), ...createNOfType(11, Tiles.wall), Tiles.startingPoint(), Tiles.path(), Tiles.wall()],
    [Tiles.wall(), Tiles.wall(), ...createNOfType(13, Tiles.path), Tiles.wall(), Tiles.wall()],
    [Tiles.wall(), Tiles.wall(), Tiles.path(), ...createNOfType(5, Tiles.wall), Tiles.path(), ...createNOfType(5, Tiles.wall), Tiles.path(), Tiles.wall(), Tiles.wall()],
    [Tiles.wall(), Tiles.wall(), Tiles.path(), ...createNOfType(5, Tiles.wall), Tiles.path(), ...createNOfType(5, Tiles.wall), Tiles.path(), Tiles.wall(), Tiles.wall()],
    [Tiles.wall(), Tiles.wall(), Tiles.path(), ...createNOfType(4, Tiles.wall), Tiles.path(), Tiles.path(), ...createNOfType(5, Tiles.wall), Tiles.path(), Tiles.wall(), Tiles.wall()],
    [Tiles.wall(), Tiles.wall(), Tiles.path(),...createNOfType(11, Tiles.wall),  Tiles.path(), Tiles.wall(), Tiles.wall()],
    [Tiles.wall(), Tiles.wall(), ...createNOfType(5, Tiles.path), Tiles.wall(), Tiles.finishPoint(), Tiles.wall(), ...createNOfType(5, Tiles.path), Tiles.wall(), Tiles.wall()],
    [Tiles.wall(), Tiles.wall(), Tiles.path(), ...createNOfType(5, Tiles.wall), Tiles.wall(), ...createNOfType(5, Tiles.wall), Tiles.path(), Tiles.wall(), Tiles.wall()],
    [Tiles.wall(), Tiles.wall(), Tiles.path(), ...createNOfType(3, Tiles.wall), Tiles.path(), Tiles.wall(), Tiles.path(),  ...createNOfType(5, Tiles.wall), Tiles.path(), Tiles.wall(), Tiles.wall()],
    [Tiles.wall(), Tiles.wall(), Tiles.path(), ...createNOfType(5, Tiles.wall), Tiles.path(), Tiles.wall(), ...createNOfType(4, Tiles.wall), Tiles.path(), Tiles.wall(), Tiles.wall()],
    [Tiles.wall(), Tiles.wall(), Tiles.path(), ...createNOfType(5, Tiles.wall), Tiles.path(), ...createNOfType(5, Tiles.wall), Tiles.path(), Tiles.wall(), Tiles.wall()],
    [Tiles.wall(), Tiles.wall(), ...createNOfType(13, Tiles.path), Tiles.wall(), Tiles.wall()],
    [Tiles.wall(), Tiles.path(), Tiles.startingPoint(), ...createNOfType(11, Tiles.wall), Tiles.startingPoint(), Tiles.path(), Tiles.wall()],
    createNOfType(17, Tiles.wall),
]

const k2 = new Key(TileType.KEY_TWO, TilePosition.fromDto({row: 1, col: 1}));
const k1 = new Key(TileType.KEY_ONE, TilePosition.fromDto({row: 1, col: 15}));
const k3 = new Key(TileType.KEY_THREE, TilePosition.fromDto({row: 13, col: 1}));
const k4 = new Key(TileType.KEY_FOUR, TilePosition.fromDto({row: 13, col: 15}));

k1.holds = "k1";
k2.holds = "k2";
k3.holds = "k3";
k4.holds = "k4";

k1.player = TilePosition.fromDto({row: 13, col: 2});
k2.player = TilePosition.fromDto({row: 13, col: 14})
k3.player = TilePosition.fromDto({row: 1, col: 14});
k4.player = TilePosition.fromDto({row: 1, col: 2});

board[1][1] = (row: number, col: number) => k2;
board[1][15] = (row: number, col: number) => k1;
board[13][1] = (row: number, col: number) => k3;
board[13][15] = (row: number, col: number) => k4;

const h1 = new KeyHole(TileType.HOLE_ONE, TilePosition.fromDto({row: 8, col: 6}))
const h2 = new KeyHole(TileType.HOLE_TWO, TilePosition.fromDto({row: 9, col: 9}))
const h3 = new KeyHole(TileType.HOLE_THREE, TilePosition.fromDto({row: 6, col: 10}))
const h4 = new KeyHole(TileType.HOLE_FOUR, TilePosition.fromDto({row: 5, col: 7}));

h1.opens = {row: 7, col: 7};
h1.keyName = "k1";
h2.opens = {row: 8, col: 8};
h2.keyName = "k2";
h3.opens = {row: 7, col: 9};
h3.keyName = "k3";
h4.opens = {row: 6, col: 8};
h4.keyName = "k4";

board[8][6] = (row: number, col: number) => h1;
board[9][9] = (row: number, col: number) => h2;
board[6][10] = (row: number, col: number) => h3;
board[5][7] = (row: number, col: number) => h4;

const kr1 = new KillRandom(TileType.KILL_RADNOM, TilePosition.fromDto( {row: 1, col: 8}));
const kr2 = new KillRandom(TileType.KILL_RADNOM, TilePosition.fromDto( {row: 13, col: 8}))

board[1][8] = (row: number, col: number) => kr1;
board[13][8] = (row: number, col: number) => kr2;

board[2][4] = Tiles.spikes();
board[2][12] = Tiles.spikes();

board[12][4] = Tiles.spikes();
board[12][12] = Tiles.spikes();


export default () => board;