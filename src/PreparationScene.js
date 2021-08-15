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

    init(){
        const { player } = this.app;

        for (const { size, direction, startX, startY } of ShipDatas) {
            const ship = new Ship(size, direction, startX, startY);
            player.addShip(ship);
        }
    }

    update(){}
}