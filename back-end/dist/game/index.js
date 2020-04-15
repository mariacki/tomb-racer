"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultGameService_1 = require("./service/DefaultGameService");
__export(require("./contract"));
exports.configure = (ctx) => {
    return new DefaultGameService_1.DefaultGameService(ctx);
};
//# sourceMappingURL=index.js.map