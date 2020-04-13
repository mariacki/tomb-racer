import 'mocha';
import assert from 'assert';
import rnd from '../../src/rnd';

describe('rnd', () => {
    it ('result is in ragne', () => {
        const res = rnd(1, 6);

        assert.equal(true, res >= 1);
        assert.equal(true, res <= 6);
    })
})

