class OnlineScene extends Scene{
    status = "";
    ownTurn = false;

    removeEventListeners = [];

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

        socket.on("message", (message, playerString) => {
            const div = document.createElement("div");
            div.classList.add("app-message");
            div.textContent = message;

            if (playerString === "player2") {
                console.log('player2');
                div.classList.add("text-right");
            } else if (playerString === "player1") {
                console.log('player1');
                div.classList.add("text-left");
            }

            const chat = document.querySelector(".app-messages");
            chat.append(div);
        });

        socket.on('challengeOpponent', key => {
            history.pushState(null, null, `/${key}`);
            alert(`Первый кто перейдет по этой ссылке будет играть с Вами:\n${location.href}`);
        });

        // -- оставил на потом(не применяется)
        // socket.on("addShoot", ({x, y, variant}) => {
        //     const shoot = new ShootView(x, y, variant);

        //     if (this.ownTurn) {
        //         this.app.opponent.addShoot(shoot);
        //     } else {
        //         this.app.player.addShoot(shoot);
        //     }
        // });
        // --/ оставил на потом(не применяется)

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

        socket.on("setStars", (ownShips, opponentShips) => {

            player.removeAllStars();

            for(const ship of ownShips){
                player.addStars(ship);
            }

            opponent.removeAllStars();

            for(const ship of opponentShips){
                opponent.addStars(ship);
            }
        });

        this.statusUpdate();
    }

    start(variant, key = '') {
        console.log("Online scene start");

        const { socket, player } = this.app;

        socket.emit("shipSet", player.ships.map((ship) => ({
            size: ship.size,
            direction: ship.direction,
            x: ship.x,
            y: ship.y
            }))
        );

        if (variant === 'random') {
            socket.emit("findRandomOpponent");
        } else if (variant === 'challenge') {
            socket.emit("challengeOpponent", key);
        }

        document.querySelector(`[data-type="play"]`).hidden = true; 
        document.querySelector(`[data-type="random"]`).hidden = true;
        document.querySelector(`[data-type="manually"]`).hidden = true;
        document.querySelector(`[data-type="surrender"]`).hidden = true;
        document.querySelector(`[data-type="randomPlayer"]`).hidden = true;
        document.querySelector(`[data-type="challenge"]`).hidden = true;
        document.querySelector(`[data-type="takeChallenge"]`).hidden = true;
        document.querySelector(".app-messages").textContent = "";

        const chat = document.querySelector(".app-chat");
        chat.hidden = false;
        

        const btnGaveUp = document.querySelector('[data-type="surrender"]');
        const btnAgain = document.querySelector('[data-type="again"]');
        let battleStatus = document.querySelector(".battle-status");
        

        battleStatus.style.visibility= `visible`;

        btnGaveUp.textContent = "Сдаться";
        btnGaveUp.hidden = false;
        btnAgain.hidden = true;

        this.removeEventListeners = [];

        const input = document.querySelector(".app-chatinput");

        this.removeEventListeners.push(
			addListener(input, "keydown", (e) => {
                if (e.key === 'Enter' && input.value) {
                    const message = input.value;
                    input.value = '';
                    socket.emit("message", message);
                }
			})
		);

        this.removeEventListeners.push(
			addListener(btnAgain, "click", () => {
				this.app.start("preparation");
			})
		);

		this.removeEventListeners.push(
			addListener(btnGaveUp,"click", () => {
				socket.emit("gaveup");
				this.app.start("preparation");
			})
		);

        this.statusUpdate();
    }

    stop() {
        for(const removeEventListener of this.removeEventListeners){
            removeEventListener(); 
        }

        this.removeEventListeners = [];
        document.querySelector(".app-chat").hidden = true;
        document.querySelector(".app-messages").textContent = "";
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
        } else if (this.status === "winner") {
            divStatus.textContent = "Вы победили!!!";
            console.log("отработал выиграш")
        } else if (this.status === "loser") {
            divStatus.textContent = "Вы проиграли(";
            console.log("отработал ПРОИГРЫШ")
        } else if (this.status === "waiting") {
            divStatus.textContent = "Ожидаем соперника";
        }
    }

    update() {
        const { mouse, opponent, socket, player } = this.app;

        const cells = opponent.cells.flat();

        if (['loser', 'winner'].includes(this.status)) {
            const btnGaveUp = document.querySelector('[data-type="surrender"]');
            const btnAgain = document.querySelector('[data-type="again"]');
            btnGaveUp.hidden = true;
            btnAgain.hidden = false;
        }
 
        if (player.loser) {
            return;
        }

        if (opponent.isUnder(mouse)) {
            const cell = opponent.cells.flat().find(cell => isUnderPoint(mouse, cell));

            if (cell) {
                if (mouse.left && !mouse.pLeft) {
                    const x = parseInt(cell.dataset.x);
                    const y = parseInt(cell.dataset.y);

                    const item = opponent._private_matrix[y][x];
        
                    if (!item.star && !item.shoot) {
                        socket.emit("addShoot", x, y);
                    }
                }
            }
        }
    }
} 