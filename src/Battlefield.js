const ShipDatas = [
    {size: 4, direction: "row", startX: 10, startY: 345 },
    {size: 3, direction: "row", startX: 10, startY: 395 },
    {size: 3, direction: "row", startX: 120, startY: 390 },
    {size: 2, direction: "row", startX: 10, startY: 435 },
    {size: 2, direction: "row", startX: 88, startY: 435 },
    {size: 2, direction: "row", startX: 167, startY: 435 },
    {size: 1, direction: "row", startX: 10, startY: 480 },
    {size: 1, direction: "row", startX: 55, startY: 480 },
    {size: 1, direction: "row", startX: 100, startY: 480 },
    {size: 1, direction: "row", startX: 145, startY: 480 },
]

class Battlefield {
    div = null;
    table = null;
    
    cells = [];
    ships = [];
    shoots = [];

    constructor(){
        const table = document.createElement("table");
        const div = document.createElement("div");
        div.classList.add("battlefield");

        this.table = table;
        this.div = div;

        for(let y = 0; y < 10; y++){
            const row = [];
            let tr = document.createElement("tr");
            tr.dataset.y = y;
            for (let x = 0; x < 10; x++) {
                let td = document.createElement("td");
                td.dataset.y = y;
                td.dataset.x = x;
                tr.append(td);
                row.push(td);
            }
            table.append(tr);
            this.cells.push(row);
        }

        div.append(table);

        for (let x = 0; x < 10; x++) {
            const cell = this.cells[0][x];
            const marker = document.createElement("div");
            
            marker.classList.add("marker", "marker-row");
            marker.textContent = "АБВГДЕЖЗИК"[x];
            cell.append(marker);
        }
        
        for (let y = 0; y < 10; y++) {
            const cell = this.cells[y][0];
            const marker = document.createElement("div");

            marker.classList.add("marker", "marker-column");
            marker.textContent = y + 1;
            cell.append(marker);
        }

    }

}