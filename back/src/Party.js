const Battlefield = require("./Battlefield");

module.exports = class Party{
    player1 = null;
    player2 = null;

    turnPlayer = null;

    constructor(player1, player2) {
        Object.assign(this, { player1, player2 });
        this.turnPlayer = player1;

        player1.party = this;
        player2.party = this;

        player1.emit("statusChange", "play");
        player2.emit("statusChange", "play");

        this.turnUpdate();
    }
    turnUpdate() {
        this.player1.emit("turnUpdate", this.player1 === this.turnPlayer);
        this.player2.emit("turnUpdate", this.player2 === this.turnPlayer);
    }
};