class Battlefield {
    div = null;
    table = null;

    dock = null; //хранятся все div-ы кораблей

    cells = [];
    ships = [];
    shoots = [];

    _private_matrix = null;
    _private_changed = true;

    get matrix(){
        if (!this._private_changed) {
            this._private_matrix;
        }

        const matrix = [];

        for (let y = 0; y < 10; y++) {
            const row = [];
            for (let x = 0; x < 10; x++) {
                const item = {
                    x,
                    y,
                    ship: null,
                    free: true,
                }
                row.push(item);
            }
            matrix.push(row);
        }

        for (const ship of this.ships) {
            if (!ship.placed) {
                continue;
            }

            const { x, y } = ship;

            const dx = ship.direction === "row";
            const dy = ship.direction === "column";

            for(let i = 0; i < ship.size; i++){
                const cx = x + dx * i;
                const cy = y + dy * i;
                
                const item = matrix[cy][cx];
                item.ship = ship;
            }

            for(let y = ship.y - 1; y < ship.y + ship.size * dy + dx + 1; y++){
                for (let x = ship.x - 1; x < ship.x + ship.size * dx + dy + 1; x++){
                    if(this.inField(x,y)){
                        const item = matrix[y][x];
                        item.free = false;   
                    }
                }
            }

            
        }

        console.log("matrix update");
        this._private_matrix = matrix;
        this._private_changed = false;

        return this._private_matrix;
    }

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

    addShip(ship, x, y){
        if (this.ships.includes(ship) ) {
            return false;
        }
        let LogicFlag = true;

        this.ships.push(ship);

        if (this.inField(x,y)) {
            let placed = true;

            const dx = ship.direction === "row";
            const dy = ship.direction === "column";
    
            for(let i = 0; i < ship.size; i++){
                    const cx = x + dx * i;
                    const cy = y + dy * i;
    
                if (!this.inField(cx, cy)) {
                    placed = false;
                    break;
                }
                
                const item = this.matrix[cy][cx];
                
                if (!item.free) {
                    placed = false;
                    break;
                }
            }
    
            if (placed) {
                Object.assign(ship, { x, y });
            }
        }
            
        this.dock.append(ship.div);

        if(ship.placed){
            const cell = this.cells[y][x];
            const cellRect = cell.getBoundingClientRect();
            const battlefieldRect = this.div.getBoundingClientRect();

            ship.div.style.left = `${cellRect.left - battlefieldRect.left}px`;
            ship.div.style.top = `${cellRect.top - battlefieldRect.top}px`;
        } else{
            ship.setDirection("row");
            ship.div.style.left = `${ship.startX}px`;
            ship.div.style.top = `${ship.startY}px`;
        }
            
        this._private_changed = true;
        return true;
    }

    removeShip(ship){
        if (!this.ships.includes(ship)) {
            return false;
        }

        const index = this.ships.indexOf(ship);
        this.ships.splice(index, 1);

        ship.x = null;
        ship.y = null;

        if(Array.prototype.includes.call(this.dock.children, ship.div)){
            ship.div.remove();
        }

        this._private_changed = true;
        return true;
    }

    inField(x, y){
        const isNumber = (n) => 
        parseInt(n) === n && !isNaN(n) && ![Infinity, -Infinity].includes(n);
        if (!isNumber(x) || !isNumber(y)) {
            return false;
        }
        return 0 <= x && x < 10 && 0 <= y && y < 10;
    }

    isUnder(point){
        return this.isUnderPoint(point, this.div);
    }
}