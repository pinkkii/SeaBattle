const Battlefield = require("./Battlefield");

module.exports = class Party{
    player1 = null;
    player2 = null;

    battlefield1 = new Battlefield();
    battlefield2 = new Battlefield();

    player1Turn = true;

    constructor(player1, player2) {
        Object.assign(this, { player1, player2 });

        this.player1.emit("partyPreparation");
        this.player2.emit("partyPreparation");

        this.turnUpdate();
    }
    turnUpdate() {
        this.player1.emit("turnUpdate", this.player1Turn);
        this.player2.emit("turnUpdate", !this.player1Turn);
    }
};