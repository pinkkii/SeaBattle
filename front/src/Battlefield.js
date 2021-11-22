class Battlefield {
    ships = [];
    shoots = [];
    stars = [];

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
                    star: false,
                    ship: null,
                    free: true,
                    shoot: false,
                    wounded: false,
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

        for(const { x, y } of this.shoots){
            const item = matrix[y][x];
            item.shoot = true;

            if(item.ship){
                item.wounded = true;
            }
        }

        for (const { x, y } of this.stars) {
            const item = matrix[y][x];
            item.star = true;
        }

        this._private_matrix = matrix;
        this._private_changed = false;

        return this._private_matrix;
    }

    get loser(){
        for (const ship of this.ships) {
            if(!ship.killed){
                return false;
            }
        }
        return true;
    }

    get killedShip() {
        for(const ship of this.ships){
            if(ship.killed && !ship.stars){
                return ship;
            }
        }
        return false;
    }

    get complete() {
        if(this.ships.length !== 10){
            return false;
        }

        for(let ship of this.ships){
            if(!ship.placed){
                return false;
            }
        }
        
        return true;
    }

    addStars(ship) {
        for (const { x, y } of this.stars) {
            if (x === ship.x && y === ship.y) {
                console.log("addStar return false");
                return false;
            }
        }

        const dx = ship.direction === "row";
        const dy = ship.direction === "column";

        for(let y = ship.y - 1; y < ship.y + ship.size * dy + dx + 1; y++){
            for (let x = ship.x - 1; x < ship.x + ship.size * dx + dy + 1; x++){
                if(this.inField(x,y)){
                    const item = this.matrix[y][x];
                    if(!item.ship && !ship.stars && !item.shoot){
                        item.star = true;
                        item.shoot = true;
                        item.free = false;
                        const star = new Star(x, y);
                    }
                }
            }
        }

        ship.stars = true;
        
        this._private_changed = true;
        return true;
    }

    removeStars(star){
        if (!this.stars.includes(star)) {
            return false;
        }

        const index = this.stars.indexOf(star);
        this.stars.splice(index, 1);

        this._private_changed = true;
        return true;
    }

    removeAllStars(){
        const stars = this.stars.slice();

        for (const star of stars) {
            this.removeStars(star);
        }

        return stars.length;
    }

    addShip(ship, x, y){
        if (this.ships.includes(ship) ) {
            return false;
        }

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

        this._private_changed = true;
        return true;
    }

    removeAllShips(){
        const ships = this.ships.slice();

        for (const ship of ships) {
            this.removeShip(ship);
        }

        return true;
    }

    addShoot(shoot) {
        for (const { x, y } of this.shoots) {
            if (x === shoot.x && y === shoot.y) {
                console.log("какого хуя?");
                return false;
            }
        }
        
        this.shoots.push(shoot);

        const matrix = this.matrix;
        const { x, y } = shoot;

        if (matrix[y][x].ship) {
            shoot.setVariant("wounded");

            const { ship } = matrix[y][x];
            const dx = ship.direction === "row";
            const dy = ship.direction === "column";

            let killed = true;

            for(let i = 0; i < ship.size; i++){
                const cx = ship.x + dx * i;
                const cy = ship.y + dy * i;
                const item = matrix[cy][cx];

                if(!item.wounded){
                    killed = false;
                    break;
                }

            }

            if(killed){
                ship.killed = true;
                
                for(let i = 0; i < ship.size; i++){
                    const cx = ship.x + dx * i;
                    const cy = ship.y + dy * i;

                    const shoot = this.shoots.find(shoot => shoot.x === cx && shoot.y === cy);
                    shoot.setVariant("killed");
                }
            }
        }

        this._private_changed = true;

        return true;
    }

    removeShoot(shoot) {
        if (!this.shoots.includes(shoot)) {
            return false;
        }

        const index = this.shoots.indexOf(shoot);
        this.shoots.splice(index, 1);

        this._private_changed = true;
        return true;
    }

    removeAllShoots() {
        const shoots = this.shoots.slice();

        for (const shoot of shoots) {
            this.removeShoot(shoot);
        }

        return shoots.length;
    }

    randomize(){
        this.removeAllShips();

        for(let size = 4; size >= 1; size--){
            for(let n = 0; n < 5 - size; n++){
                const newDir = getRandomDirection();
                const ship = new ShipView(size, newDir);

                while (!ship.placed) {
                    const x = getRandomBetween(0,9);
                    const y = getRandomBetween(0,9);

                    this.removeShip(ship);
                    this.addShip(ship, x, y);
                }
            }
        }

    }

    inField(x, y){
        const isNumber = (n) =>
        parseInt(n) === n && !isNaN(n) && ![Infinity, -Infinity].includes(n);
        if (!isNumber(x) || !isNumber(y)) {
            return false;
        }
        return 0 <= x && x < 10 && 0 <= y && y < 10;
    }

    clear() {
		this.removeAllShoots();
		this.removeAllShips();
        this.removeAllStars();
	}
}