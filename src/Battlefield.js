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