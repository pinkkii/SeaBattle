const Battlefield = require("./Battlefield");
const Shoot = require("./Shoot");

module.exports = class Party{
    player1 = null;
    player2 = null;

    turnPlayer = null;

    get nextPlayer() { 
        return this.turnPlayer === this.player1 ? this.player2 : this.player1;
    }

    constructor(player1, player2) {
        Object.assign(this, { player1, player2 });
        this.turnPlayer = player1;

        for(const player of [player1, player2]){
            player.party = this;
            player.emit("statusChange", "play");

            player.on("addShoot", (x, y) => {
                if (this.turnPlayer !== player) {
                    return;
                }
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
                }
            });

            player.on("addStars", () => {
                console.log("PARTY addStars");
                if (this.turnPlayer !== player) {
                    console.log("PARTY addStars RETURN");
                    return;
                }

                const dieShip = player1.battlefield.killedShip || player2.battlefield.killedShip;

                if (dieShip) {
                    const player1Stars = player1.battlefield.ships.map( (ship) => (dieShip));
                    const player2Stars = player2.battlefield.stars.map((ship) => ({
                        x: ship.x,
                        y: ship.y,
                    }));

                    player1.emit("setStars", player1Stars, player2Stars);
                    player2.emit("setStars", player2Stars, player1Stars);
                    console.log("dieShip1", player1Stars);
                    console.log("dieShip2", player2Stars);
                }
            });
        }
        this.turnUpdate();
    }
    turnUpdate() {
        this.player1.emit("turnUpdate", this.player1 === this.turnPlayer);
        this.player2.emit("turnUpdate", this.player2 === this.turnPlayer);
    }
};