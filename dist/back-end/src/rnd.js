"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rnd = (start, end) => {
    const random = Math.random();
    return start + Math.round((end - 1) * random);
};
exports.default = rnd;
//# sourceMappingURL=rnd.js.map