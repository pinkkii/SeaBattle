class OnlineScene extends Scene{
    status = "";
    ownTurn = false;

    init() {
        const { socket, player, opponent } = this.app;

        socket.on("statusChange", (status) => {
            this.status = status;
            this.statusUpdate();
        });

        socket.on("turnUpdate", (ownTurn) => {
            this.ownTurn = ownTurn;
            this.statusUpdate();
        });

        socket.on("addShoot", ({x, y, variant}) => {
            const shoot = new ShootView(x, y, variant);

            if (this.ownTurn) {
                this.app.opponent.addShoot(shoot);
            } else {
                this.app.player.addShoot(shoot);
            }
        });

        socket.on("setShoots", (ownShoots, opponentShoots) => {
            player.removeAllShoots();

            for(const {x, y, variant} of ownShoots){
                const shoot = new ShootView(x, y, variant);
                player.addShoot(shoot);
            }

            opponent.removeAllShoots();

            for(const {x, y, variant} of opponentShoots){
                const shoot = new ShootView(x, y, variant);
                opponent.addShoot(shoot);
            }
        });

        socket.on("addStars", () => {
            console.log("addStarsOnline");
            if (this.ownTurn) {
                const ship = opponent.killedShip;
                if (ship) {
                    this.app.opponent.addStars(ship);
                }
            } else {
                const ship = player.killedShip;
                if (ship) {
                    this.app.player.addShoot(ship);   
                }
            }
        });

        socket.on("setStars", (ownStars, opponentStars) => {
            console.log("setStars");

            const ship = opponent.killedShip;
            console.log("setStars1", ship);
            this.app.opponent.addStars(ship);
            console.log("setStars2");
            player.removeAllStars();

            for(const ship of ownStars){
                player.addShoot(ship);
                сonsole.log("ship: ", ship);
            }

            opponent.removeAllStars();

            for(const ship of opponentStars){
                opponent.addShoot(ship);
            }
        });

        this.statusUpdate();
    }

    start(variant) {
        const { socket, player } = this.app;

        socket.emit("shipSet", player.ships.map((ship) => ({
            size: ship.size,
            direction: ship.direction,
            x: ship.x,
            y: ship.y
            }))
        );
 
        socket.emit("findRandomOpponent");

        document.querySelector(`[data-type="play"]`).hidden = true;
        document.querySelector(`[data-type="random"]`).hidden = true;
        document.querySelector(`[data-type="manually"]`).hidden = true;
        document.querySelector(`[data-type="surrender"]`).hidden = true;
        document.querySelector(`[data-type="randomPlayer"]`).hidden = true;

        this.statusUpdate();
    }

    statusUpdate() {
        const divStatus = document.querySelector(".battle-status");
        const playerStatus = document.querySelector(`[data-status="player"]`);
        const opponentStatus = document.querySelector(`[data-status="opponent"]`);
        if (!this.status) {
            divStatus.textContent = "";
        } else if (this.status === "randomFinding") {
            divStatus.textContent = "Поиск случайного соперника";
        } else if (this.status === "play") {
            divStatus.textContent = this.ownTurn ? "Ваш ход" : "Ход соперника";
            if (this.ownTurn) {
                playerStatus.style.backgroundColor = `rgba(17, 158, 17, .6)`;
                opponentStatus.style.backgroundColor = `rgba(224, 24, 24, .6)`;
            } else {
                playerStatus.style.backgroundColor = `rgba(224, 24, 24, .6)` ;
                opponentStatus.style.backgroundColor = `rgba(17, 158, 17, .6)`;
            }
        }
    }

    update() {
        const { mouse, opponent, socket, player } = this.app;

        const cells = opponent.cells.flat();
 

        if (opponent.isUnder(mouse)) {
            const cell = opponent.cells.flat().find(cell => isUnderPoint(mouse, cell));

            if (cell) {
                if (mouse.left && !mouse.pLeft) {
                    const x = parseInt(cell.dataset.x);
                    const y = parseInt(cell.dataset.y);

                    socket.emit("addShoot", x, y);
                    socket.emit("addStars");
                    // console.log("shiP",this.app.opponent.killedShip);
                    // console.log("shiP",this.app.player.killedShip);
                    // if(opponent.killedShip){
                    //     socket.emit("addStars");
                    //     console.log("shiP",opponent.killedShip);
                    // }

                }
            }
        }
    }
}