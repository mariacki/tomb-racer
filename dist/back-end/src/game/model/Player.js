"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(userId, userName, startingPoisition) {
        this.hp = 100;
        this.inventory = [];
        this.userId = userId;
        this.userName = userName;
        this.position = startingPoisition;
        this.startedOn = startingPoisition;
    }
    hadDied() {
        return this.hp <= 0;
    }
    restore() {
        this.position = this.startedOn;
        this.hp = 100;
    }
    takeHit(hpTaken) {
        this.hp -= hpTaken;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map