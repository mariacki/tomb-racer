import { Tiles, Tile } from '../game';

export const board = [
    [
        Tiles.startingPoint(),
        Tiles.startingPoint(),
        Tiles.startingPoint(),
        Tiles.startingPoint(),
        Tiles.startingPoint(),

        Tiles.path(),
        Tiles.path(),
        Tiles.path(),
        Tiles.path(),
        Tiles.path(),
    ],
    [
        Tiles.spikes(),

        Tiles.wall(),
        Tiles.wall(),
        Tiles.wall(),
        Tiles.wall(),
        Tiles.wall(),
        Tiles.wall(),

        Tiles.spikes(),
        
        Tiles.wall(),
        Tiles.path(),
    ], 
    [
        Tiles.spikes(),

        Tiles.path(),
        Tiles.path(),
        Tiles.path(),
        Tiles.path(),
        Tiles.path(),
        Tiles.path(),
        Tiles.path(),
        Tiles.path(),
        Tiles.path(),
    ],
    [
        Tiles.path(), 

        Tiles.wall(),
        
        Tiles.spikes(),

        Tiles.wall(),
        Tiles.wall(),
        Tiles.wall(),
        Tiles.wall(),
        Tiles.wall(),
        Tiles.wall(),

        Tiles.path(),
    ],
    [
        Tiles.path(),
        Tiles.spikes(),
        Tiles.path(),
        Tiles.path(),
        Tiles.path(),

        Tiles.spikes(), 

        Tiles.wall(),
        Tiles.wall(),
        Tiles.wall(),
        
        Tiles.path()
    ],
    [
        Tiles.path(),
        Tiles.wall(),
        Tiles.path(),

        Tiles.wall(),
        Tiles.wall(),

        Tiles.spikes(),

        Tiles.wall(),
        Tiles.wall(),
        Tiles.wall(),
        Tiles.spikes()
    ],
    [
        Tiles.path(),
        Tiles.wall(),
        Tiles.path(),

        Tiles.wall(),
        Tiles.wall(),

        Tiles.spikes(),
        
        Tiles.path(),
        Tiles.path(),
        Tiles.path(),
        Tiles.path(),
    ],
    [
        Tiles.path(),
        Tiles.wall(),
        Tiles.spikes(),
        Tiles.wall(),
        Tiles.finishPoint(),
        Tiles.spikes(),
        Tiles.path(),
        Tiles.spikes(),
        Tiles.wall(),
        Tiles.spikes()
    ],
    [
        Tiles.path(),
        Tiles.wall(),
        Tiles.path(),
        Tiles.spikes(),
        Tiles.spikes(),
        Tiles.path(), 
        Tiles.path(),
        Tiles.spikes(),
        Tiles.path(),
        Tiles.path()
    ],
    [
        Tiles.path(),
        Tiles.path(),
        Tiles.path(),
        
        Tiles.wall(),
        Tiles.wall(), 
        Tiles.wall(),
        Tiles.wall(),

        Tiles.path(),
        Tiles.path(),
        Tiles.spikes()
    ]
]