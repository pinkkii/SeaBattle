class OnlineScene extends Scene{
    status = "";
    ownTurn = false;

    init() {
        const { socket } = this.app;

        socket.on("statusChange", (status) => {
            this.status = status;
            this.statusUpdate();
        });

        socket.on("partyStart", (ownTurn) => {
            this.ownTurn = ownTurn;
            this.status = "play";
            this.statusUpdate();
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

    update() {

    }

    statusUpdate() {
        const divStatus = document.querySelector(".battle-status");

        if (!this.status) {
            divStatus.textContent = "";
        } else if (this.status === "randomFinding") {
            divStatus.textContent = "Поиск случайного соперника";
        } else if (this.status === "play") {
            divStatus.textContent = this.ownTurn ? "Ваш ход" : "Ход соперника";
        }
    }
}