const Battlefield = require("./Battlefield");
const Observer = require("./Observer");
const Shoot = require("./Shoot");

module.exports = class Party extends Observer{
    player1 = null;
    player2 = null;

    turnPlayer = null;

    play = true;

    get nextPlayer() { 
        return this.turnPlayer === this.player1 ? this.player2 : this.player1;
    }

    constructor(player1, player2) {
        super();

        Object.assign(this, { player1, player2 });
        this.turnPlayer = player1;

        for(const player of [player1, player2]){
            player.party = this;
            player.emit("statusChange", "play");
        }

        this.turnUpdate();
    }

    turnUpdate() {
        this.player1.emit("turnUpdate", this.player1 === this.turnPlayer);
        this.player2.emit("turnUpdate", this.player2 === this.turnPlayer);
    }

    stop() {
        if (!this.play) {
			return;
		}

		this.play = false;
		this.dispatch();

		this.player1.party = null;
		this.player2.party = null;

		this.player1 = null;
		this.player2 = null;
    }

    gaveup(player) {
		const { player1, player2 } = this;
        
		player1.emit("statusChange", player1 === player ? "loser" : "winner");
		player2.emit("statusChange", player2 === player ? "loser" : "winner");

		this.stop();
	}

    addShoot(player, x, y) {
        if (this.turnPlayer !== player || !this.play) {
            return;
        }
        const { player1, player2 } = this;

        const shoot = new Shoot(x, y);
        const result = this.nextPlayer.battlefield.addShoot(shoot);

        if (result) {
            const player1Shoots = player1.battlefield.shoots.map((shoot) => ({
                x: shoot.x, 
                y: shoot.y,
                variant: shoot.variant
            }));

            const player2Shoots = player2.battlefield.shoots.map((shoot) => ({
                x: shoot.x,
                y: shoot.y, 
                variant: shoot.variant
            }));

            player1.emit("setShoots", player1Shoots, player2Shoots);
            player2.emit("setShoots", player2Shoots, player1Shoots);
            
            if (shoot.variant === "miss") {
                this.turnPlayer = this.nextPlayer;
                this.turnUpdate(); 
            }

            if (shoot.variant === "killed") {
                const player1DeadShip = player1.battlefield.ships.filter(ship => ship.killed);
                const player2DeadShip = player2.battlefield.ships.filter(ship => ship.killed);        

                player1.emit("setStars", player1DeadShip, player2DeadShip);
                player2.emit("setStars", player2DeadShip, player1DeadShip);
            }
        }

        if (player1.battlefield.loser || player2.battlefield.loser) {
            this.stop();

            player1.emit("statusChange", player1.battlefield.loser ? "loser" : "winner");
            player2.emit("statusChange", player2.battlefield.loser ? "loser" : "winner");
        }
    }

    sendMessage(message) {
        const { player1, player2 } = this;

        player1.emit("message", message, "player1");
        player2.emit("message", message, "player2");
    }
};