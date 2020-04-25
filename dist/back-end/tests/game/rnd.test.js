"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const assert_1 = __importDefault(require("assert"));
const rnd_1 = __importDefault(require("../../src/rnd"));
describe('rnd', () => {
    it('result is in ragne', () => {
        const res = rnd_1.default(1, 6);
        assert_1.default.equal(true, res >= 1);
        assert_1.default.equal(true, res <= 6);
    });
});
//# sourceMappingURL=rnd.test.js.map