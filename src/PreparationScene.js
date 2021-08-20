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
    draggedOffsetX = 0;
    draggedOffsetY = 0;  
    
    init(){
        const { player } = this.app;

        for (const { size, direction, startX, startY } of ShipDatas) {
            const ship = new Ship(size, direction, startX, startY);
            player.addShip(ship);
        }
    }

    start(){
        const { player } = this.app;
        console.log(player.matrix);
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
                console.log(player.matrix);
            } else {
                player.removeShip(ship);
                player.addShip(ship);
                console.log(player.matrix);
            }
        }

        //Врощение
        if (this.draggedShip && mouse.delta) {
            this.draggedShip.toggleDirection();
        }
        

    }
}