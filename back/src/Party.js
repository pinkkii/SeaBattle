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
                console.log("Party( player.on(addShoot) )");
                
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

                    if (shoot.variant === "killed") {
                        const player1DeadShip = player1.battlefield.ships.filter(ship => ship.killed);
                        const player2DeadShip = player2.battlefield.ships.filter(ship => ship.killed);        
        
                        player1.emit("setStars", player1DeadShip, player2DeadShip);
                        player2.emit("setStars", player2DeadShip, player1DeadShip);
        
                        console.log("shoot.variant === killed: pl1 ", player1DeadShip);
                        console.log("shoot.variant === killed: pl2 ", player2DeadShip);
                    }
                }
            });

            // player.on("addStars", (ship) => {
            //     console.log("PARTY addStars");
            //     if (this.turnPlayer !== player) {
            //         console.log("PARTY addStars RETURN");
            //         return;
            //     }

            //     const player1DeadShip = player1.battlefield.ships.filter(ship => ship);
            //     const player2DeadShip = player2.battlefield.ships.filter(ship => ship);

            //     player1.emit("setStars", player1DeadShip, player2DeadShip);
            //     player2.emit("setStars", player2DeadShip, player1DeadShip);

            //     console.log("dieShip1", player1DeadShip);
            //     console.log("dieShip2", player2DeadShip);
            // });
        }
        this.turnUpdate();
    }
    turnUpdate() {
        this.player1.emit("turnUpdate", this.player1 === this.turnPlayer);
        this.player2.emit("turnUpdate", this.player2 === this.turnPlayer);
    }
};