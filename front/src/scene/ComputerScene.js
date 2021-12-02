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
        const btnRandomPlayer = document.querySelector(`[data-type="randomPlayer"]`);

        surrender.textContent = "Сдаться";
        surrender.hidden = false;
        btnRandomPlayer.hidden = true;
        
        this.removeEventListeners.push(
            addListener(surrender, "click", () => this.surrenderFunc())
        );
    }

    update() {
        const { mouse, player, opponent, bot } = this.app;
        const isUnder = isUnderPoint(mouse, opponent.div);

        let playerStatus = document.querySelector(`[data-status="player"]`);
        let opponentStatus = document.querySelector(`[data-status="opponent"]`);

        let status = document.querySelector(".result");

        let deadShip = player.killedShip || opponent.killedShip;
        this.end = player.loser || opponent.loser;

        if(deadShip){
            if(player.killedShip){
                const ship = player.killedShip;
                player.addStars(ship);
            } else {
                const ship = opponent.killedShip;
                opponent.addStars(ship);
            }
        }
        
        if(this.end){
            status.hidden = false;
            if (opponent.loser) {
                status.textContent = "Ты выиграл!!!";

            }
            else {
                status.textContent = "Ты проиграл =(";
            }
            document.querySelector(`[data-type="surrender"]`).textContent = "Вернуться в главное меню";
        }

        if(!this.end){
            if (!this.turnPlayer) {
                opponentStatus.style.backgroundColor = `rgba(17, 158, 17, .6)`;
                playerStatus.style.backgroundColor = `rgba(224, 24, 24, .6)`;
    
                bot.ShootBot();
    
                if(bot.miss === true){
                    this.turnPlayer = true;
                } else {
                     this.turnPlayer = false;
                }
            }
        
            if (this.turnPlayer) {
                opponentStatus.style.backgroundColor = `rgba(224, 24, 24, .6)`;
                playerStatus.style.backgroundColor = `rgba(17, 158, 17, .6)`;
    
                if (isUnder && mouse.left && !mouse.pLeft) {
                    const cell = opponent.cells.flat().find((cell) => isUnderPoint(mouse, cell));
                    const x = parseInt(cell.dataset.x);
                    const y = parseInt(cell.dataset.y);
            
                    console.log(x,y);
                    const item = opponent._private_matrix[y][x];
        
                    if (cell && !item.star && !item.shoot) {
                        const ship = opponent.ships.find((ship) => ship.isUnder(mouse));
                        if (ship) {
                            const shoot = new ShootView(x, y);
                            opponent.addShoot(shoot);
                        } else {
                            const shoot = new ShootView(x, y, "miss");
                            opponent.addShoot(shoot);
                            this.turnPlayer = false;
                        }
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