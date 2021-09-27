const Battlefield = require("./Battlefield");

module.exports = class Party{
    player1 = null;
    player2 = null;

    battlefield1 = new Battlefield();
    battlefield2 = new Battlefield();

    constructor(player1, player2) {
        Object.assign(this, { player1, player2 });

        player1.emit("partyStart", true);
        player2.emit("partyStart", false);
    }
}