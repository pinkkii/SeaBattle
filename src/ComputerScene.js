class ComputerScene extends Scene{

    init() {
        console.log("init computer");
        this.RandomPlaceShips();
    }

    start(){
        console.log("start Computer");
        const { opponent } = this.app;

        const btnPlay = document.querySelector(`[data-type="play"]`).hidden = true;
        const btnRandom = document.querySelector(`[data-type="random"]`).hidden = true;
        const btnManually = document.querySelector(`[data-type="manually"]`).hidden = true;
        const surrender = document.querySelector(".btn-surrender").hidden = false;



    }

    update() {}

    RandomPlaceShips(){
        const { opponent } = this.app;
        
        this.app.opponent.randomize();

        for(let i = 0; i < 10; i++){
            const ship = opponent.ships[i];

            ship.startX = ship.x;
            ship.startY = ship.y;
        }
    }
}