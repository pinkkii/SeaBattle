class Battlefield {
    div = null;
    table = null;

    dock = null; //хранятся все div-ы кораблей

    cells = [];
    ships = [];
    shoots = [];

    constructor(){
        const table = document.createElement("table");
        const div = document.createElement("div");
        div.classList.add("battlefield");

        const dock = document.createElement("div");
        dock.classList.add("battlefield-dock");

        this.table = table;
        this.div = div;
        this.dock = dock;

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

        div.append(table, dock);

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

    addShip(ship){
        if (!this.ships.includes(ship) ) {
            this.ships.push(ship);
            this.dock.append(ship.div);

            ship.div.style.left = `${ship.startX}px`;
            ship.div.style.top = `${ship.startY}px`;
        }
        else{
            console.log("addShip false");
            return false;
        }
    }
    
    // addShip(ship, x, y){


    //         this.ships.push(ship);
    //         this.dock.append(ship.div);

    //         if(ship.placed){
    //             const cell = this.cells[y][x];
    //             const cellRect = cell.getBoundingClientRect();
    //             const rootRect = this.root.getBoundingClientRect(); 
    
    //             ship.div.style.left = `${cellRect.left - rootRect.left}px`;
    //             ship.div.style.top = `${cellRect.top - rootRect.top}px`;
    //         } else{
    //             ship.setDirection("row");
    //             ship.div.style.left = `${ship.startX}px`;
    //             ship.div.style.top = `${ship.startY}px`;
    //         }
        
        
    //     return true;
    // }

    // removeShip(ship){

        
    //     if(Array.prototype.includes.call(this.dock.children, ship.div)){
    //         ship.div.remove();
    //     }
    //     return true;
    // }
}