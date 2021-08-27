class ComputerScene extends Scene{
    turnPlayer = true;
    winner = null;

    end = false;

    removeEventListeners = [];
    init() {
        console.log("init computer");
        this.RandomPlaceShips();
    }

    start(){
        console.log("start Computer");
        const { opponent } = this.app;

        this.init();

        const btnPlay = document.querySelector(`[data-type="play"]`).hidden = true;
        const btnRandom = document.querySelector(`[data-type="random"]`).hidden = true;
        const btnManually = document.querySelector(`[data-type="manually"]`).hidden = true;
        const surrender = document.querySelector(`[data-type="surrender"]`);

        surrender.hidden = false;
        
        this.removeEventListeners.push(
            addEventListener(surrender, "click", () => this.surrenderFunc())
        );

    }

    update() {
        const { mouse, player, opponent } = this.app;
        const isUnder = isUnderPoint(mouse, opponent.div);

        let playerStatus = document.querySelector(`[data-status="player"]`);
        let opponentStatus = document.querySelector(`[data-status="opponent"]`);

        let dieShip = player.killedShip || opponent.killedShip;
        this.end = player.loser || opponent.loser;

        if(dieShip){
            if(player.killedShip){
                const ship = player.killedShip;
                player.addStars(ship);
            } else {
                const ship = opponent.killedShip;
                opponent.addStars(ship);
            }
        }
        
        if(this.end){
            if (opponent.loser) {
                console.log("You win's!!!");
            }
            else {
                console.log("You lose");
            }
        } else {
            if (!this.turnPlayer) {
                opponentStatus.style.backgroundColor = `rgba(17, 158, 17, .6)`;
                playerStatus.style.backgroundColor = `rgba(224, 24, 24, .6)`;

                let x = getRandomBetween(0,9);
                let y = getRandomBetween(0,9);
        
                let shoot = new Shoot(x, y);
                let result = player.addShoot(shoot);
    
                if(shoot.variant === "wounded" || shoot.variant === "killed"){
                    console.log("result false");
                    this.turnPlayer = false;
                } else {
                    this.turnPlayer = true;
                    console.log("result true");
                }
                console.log("BOT: ", x, y);
            } else {
                opponentStatus.style.backgroundColor = `rgba(224, 24, 24, .6)`;
                playerStatus.style.backgroundColor = `rgba(17, 158, 17, .6)`;
            }
    
            
            if (isUnder && mouse.left && !mouse.pLeft) {
                const cell = opponent.cells.flat().find((cell) => isUnderPoint(mouse, cell));
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);
    
                console.log(x,y);
                const item = opponent._private_matrix[y][x];

                if (cell && !item.star && !item.shoot) {
                    const ship = opponent.ships.find((ship) => ship.isUnder(mouse));
                    if (ship) {
                        const shoot = new Shoot(x, y);
                        opponent.addShoot(shoot);
                    } else {
                        const shoot = new Shoot(x, y, "miss");
                        opponent.addShoot(shoot);
                        this.turnPlayer = false;
                    }
                }
            }
        }
    }

    RandomPlaceShips(){
        const { opponent } = this.app;
        
        this.app.opponent.randomize();

        for(let i = 0; i < 10; i++){
            const ship = opponent.ships[i];

            ship.startX = ship.x;
            ship.startY = ship.y;
        }
    }

    stop(){
        console.log("STOP computer");
        for(const removeEventListener of this.removeEventListeners){
            removeEventListener(); 
        }

        this.removeEventListeners = [];
    }

    surrenderFunc(){
        this.stop();
        this.app.start("preparation");
    }
}