const ShipDatas = [
    {size: 4, direction: "row", startX: 10, startY: 360 },
    {size: 3, direction: "row", startX: 10, startY: 400 },
    {size: 3, direction: "row", startX: 120, startY: 400 },
    {size: 2, direction: "row", startX: 10, startY: 440 },
    {size: 2, direction: "row", startX: 88, startY: 440 },
    {size: 2, direction: "row", startX: 167, startY: 440 },
    {size: 1, direction: "row", startX: 10, startY: 485 },
    {size: 1, direction: "row", startX: 55, startY: 485 },
    {size: 1, direction: "row", startX: 100, startY: 485 },
    {size: 1, direction: "row", startX: 145, startY: 485 },
]

class PreparationScene extends Scene{
    draggedShip = null;
    shadowShip = null;
    draggedOffsetX = 0;
    draggedOffsetY = 0;  

    removeEventListeners = [];
    
    init(){
        console.log("init Preparation");
        this.manually();
    }

    start(){
        console.log("preparation start");
        const { player, opponent } = this.app;

        player.removeAllShoots();
        player.removeAllStars();
        player.removeAllShips();
        this.init();
        
        opponent.removeAllShoots();
        opponent.removeAllStars();
        opponent.removeAllShips();

        const btnPlay = document.querySelector(`[data-type="play"]`);
        const btnRandom = document.querySelector(`[data-type="random"]`);
        const btnManually = document.querySelector(`[data-type="manually"]`);
        const surrender = document.querySelector(`[data-type="surrender"]`);
        const btnRandomPlayer = document.querySelector(`[data-type="randomPlayer"]`);
        const challengeBtn = document.querySelector(`[data-type="challenge"]`);
        const takeChallengeBtn = document.querySelector(`[data-type="takeChallenge"]`);

        let btnAgain = document.querySelector(`[data-type="again"]`);
        let playerStatus = document.querySelector(`[data-status="player"]`);
        let opponentStatus = document.querySelector(`[data-status="opponent"]`);
        let status = document.querySelector(".result");
        let battleStatus = document.querySelector(".battle-status");

        opponentStatus.style.backgroundColor = `rgba(224, 24, 24, .6)`;
        playerStatus.style.backgroundColor = `rgba(224, 24, 24, .6)`;
        battleStatus.style.visibility= `hidden`;

        takeChallengeBtn.hidden = false;
        challengeBtn.hidden = false;
        btnAgain.hidden = true;
        btnPlay.hidden = false;
        btnRandom.hidden = false;
        btnManually.hidden = false;
        surrender.hidden = true;
        status.hidden = true;
        btnRandomPlayer.hidden = false;

        this.removeEventListeners.push(
            addListener(btnPlay, "click", () => this.PlayButton())
        );

        this.removeEventListeners.push(
            addListener(btnRandom, "click", () => this.RandomPlaceShips())
        );

        this.removeEventListeners.push(
            addListener(btnManually, "click", () => this.manually())
        );

        this.removeEventListeners.push(
            addListener(btnRandomPlayer, "click", () => this.app.start("online", "random"))
        );

        this.removeEventListeners.push(
            addListener(challengeBtn, "click", () => this.app.start("online", "challenge"))
        );

        this.removeEventListeners.push(
            addListener(takeChallengeBtn, "click", () => {
                const key = prompt('Ключ партии: ');
                this.app.start("online", "challenge", key);
            })
        );
    }

    update(){
        const { mouse, player } = this.app;

        //потенциально хотим начать тянуть кобаль
        if (!this.draggedShip && mouse.left && !mouse.pLeft) {
            const ship = player.ships.find((ship) => ship.isUnder(mouse));
            if (ship) {
                const rect = ship.div.getBoundingClientRect();

                this.draggedShip = ship;
                this.draggedOffsetX = mouse.x - rect.left;
                this.draggedOffsetY = mouse.y - rect.top;
            }
        }

        //перетаскивание
        if (this.draggedShip && mouse.left) {
            const { left, top } = player.div.getBoundingClientRect();
            const x = mouse.x - left - this.draggedOffsetX;
            const y = mouse.y - top - this.draggedOffsetY;

            this.draggedShip.div.style.left = `${x}px`;
            this.draggedShip.div.style.top = `${y}px`;
        }

        // Бросание
        if (!mouse.left && this.draggedShip) {
            const ship = this.draggedShip;
            this.draggedShip = null;

            const { left, top } = ship.div.getBoundingClientRect();
            const { width, height } = player.cells[0][0].getBoundingClientRect();

            const point = {
                x: left + width / 2,
                y: top + height / 2,
            }

            const cell = player.cells.flat().find((cell) => isUnderPoint(point, cell));

            if (cell) {
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);

                player.removeShip(ship);
                player.addShip(ship, x, y);
            } else {
                player.removeShip(ship);
                player.addShip(ship);
            }
        }

        //Врощение
        if (this.draggedShip && mouse.delta) {
            this.draggedShip.toggleDirection();
        }

        //если все корабли расставлены, включается кнопка БОЯ
        if (player.complete) {
            document.querySelector(`[data-type="play"]`).disabled = false;
            document.querySelector(`[data-type="randomPlayer"]`).disabled = false;
            document.querySelector(`[data-type="challenge"]`).disabled = false;
            document.querySelector(`[data-type="takeChallenge"]`).disabled = false;
        } else {
            document.querySelector(`[data-type="play"]`).disabled = true;
            document.querySelector(`[data-type="randomPlayer"]`).disabled = true;
            document.querySelector(`[data-type="challenge"]`).disabled = true;
            document.querySelector(`[data-type="takeChallenge"]`).disabled = true;
        }
    }

    stop(){
        console.log("STOP preparation");
        for(const removeEventListener of this.removeEventListeners){
            removeEventListener(); 
        }

        this.removeEventListeners = [];
    }

    manually(){
        const { player } = this.app;

        player.removeAllShips();

        for (const { size, direction, startX, startY } of ShipDatas) {
            const ship = new ShipView(size, direction, startX, startY);
            player.addShip(ship);
        }
    }

    RandomPlaceShips(){
        const { player } = this.app;
        
        this.app.player.randomize();

        for(let i = 0; i < 10; i++){
            const ship = player.ships[i];

            ship.startX = ShipDatas[i].startX;
            ship.startY = ShipDatas[i].startY;
        }
    }

    PlayButton(){
        console.log("PlayButton");
        this.stop();
        this.app.start("computer");
    }
}