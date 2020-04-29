import 'mocha';
import assert from 'assert';
import { PlayerCollection } from '../../src/game/model/PlayerCollection';
import { Player } from '../../src/game/model';
import { TilePosition } from '../../src/game';

describe('Player collection', () => {
    it ('removes player', () => {
        const collection = new PlayerCollection();

        collection.push(new Player("example-id", "example", TilePosition.fromDto({row: 0, col: 0})));

        collection.removeHavingId("example-id");

        assert.equal(collection.getAll().length, 0);
    })
})