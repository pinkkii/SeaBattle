class BattlefieldView extends Battlefield{
    div = null;
    table = null;

    dock = null;        // хранятся все div-ы кораблей
    polygon = null;     // хранятся все div-ы выстрелов
    dockStars = null;   // хранятся все div-ы звёздочек

    showShip = true;

	cells = [];

	constructor(showShip = true) {
		super();

		const table = document.createElement("table");
        const div = document.createElement("div");
        div.classList.add("battlefield");

        const dock = document.createElement("div");
        dock.classList.add("battlefield-dock");

        const polygon = document.createElement("div");
        polygon.classList.add("battlefield-polygon");

        const dockStars = document.createElement("div");
        dockStars.classList.add("Stars");

        Object.assign(this, { table, div, dock, showShip, polygon, dockStars });

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

        div.append(table, dock, polygon, dockStars);

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

	addShip(ship, x, y) {
		if (!super.addShip(ship, x, y)) {
			return false;
		}

		if (this.showShip) {
            this.dock.append(ship.div);

            if(ship.placed) {
                const cell = this.cells[y][x];
                const cellRect = cell.getBoundingClientRect();
                const battlefieldRect = this.div.getBoundingClientRect();

                ship.div.style.left = `${cellRect.left - battlefieldRect.left}px`;
                ship.div.style.top = `${cellRect.top - battlefieldRect.top}px`;
            } else {
                ship.setDirection("row");
                ship.div.style.left = `${ship.startX}px`;
                ship.div.style.top = `${ship.startY}px`;
            }
        }

		return true;
	}

	removeShip(ship) {
		if (!super.removeShip(ship)) {
			return false;
		}

		if (Array.prototype.includes.call(this.dock.children, ship.div)) {
			ship.div.remove();
		}

		return true;
	}

	addShoot(shoot) {
		if (!super.addShoot(shoot)) {
			return false;
		}

		this.polygon.append(shoot.div);

		const cell = this.cells[shoot.y][shoot.x];
        const cellRect = cell.getBoundingClientRect();
        const divRect = this.div.getBoundingClientRect();

        shoot.div.style.left = `${cellRect.left - divRect.left}px`;
        shoot.div.style.top = `${cellRect.top - divRect.top}px`;

		return true;
	}

	removeShoot(shoot) {
		if (!super.removeShoot(shoot)) {
			return false;
		}

		if (Array.prototype.includes.call(this.polygon.children, shoot.div)) {
			shoot.div.remove();
		}

		return true;
	}

    addStars(ship){
        if (!super.addStars(ship)) {
			return false;
		}

        const dx = ship.direction === "row";
        const dy = ship.direction === "column";

        for(let y = ship.y - 1; y < ship.y + ship.size * dy + dx + 1; y++){
            for (let x = ship.x - 1; x < ship.x + ship.size * dx + dy + 1; x++){
                if(this.inField(x,y)){
                    const item = this.matrix[y][x];
                    if(!item.ship && !item.shoot){

                        const star = new StarView(x, y);
                        
                        this.matrix[y][x].shoot = true;

                        this.stars.push(star);

                        this.dockStars.append(star.div);

                        const cell = this.cells[star.y][star.x];
                        const cellRect = cell.getBoundingClientRect();
                        const divRect = this.div.getBoundingClientRect();

                        star.div.style.left = `${cellRect.left - divRect.left}px`;
                        star.div.style.top = `${cellRect.top - divRect.top}px`;
                        star.div.style.fontSize = `60px`;
                    }
                }
                
            }
        }

        return true;
    }

    removeStars(star){
		if (!super.removeStars(star)) {
			return false;
		}

        if (Array.prototype.includes.call(this.dockStars.children, star.div)) {
            star.div.remove()
		}

        return true;
    }

    isUnder(point){
        return isUnderPoint(point, this.div);
    }
}