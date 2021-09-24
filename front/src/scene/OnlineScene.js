class OnlineScene extends Scene{
    status = "";

    init() {
        const { socket } = this.app;

        socket.on("statusChange", (status) => {
            this.status = status;
            this.statusUpdate();
        });

        this.statusUpdate();
    }

    start(variant) {
        const { socket } = this.app;

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
        }
    }
}