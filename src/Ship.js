class Ship {
    startX = null;
    startY = null;

    x = null;
    y= null;

    direction = null;
    killed = false;
    size = null;
    div = null;

    get placed(){
        return this.x !== null && this.y !== null;
    }
    
    constructor(size, direction, startX, startY){
        const div = document.createElement("div");
        div.classList.add("ship");

        Object.assign(this, { direction, size, startX, startY, div });

        this.setDirection(direction, true);
    }

    setDirection(newDirection, force = false){
        if (!force && this.direction === newDirection) {
            return false;
        }
        this.div.classList.remove(`ship-${this.direction}-${this.size}`);
        this.direction = newDirection;
        this.div.classList.add(`ship-${this.direction}-${this.size}`);
        return true;
    }
    
    toggleDirection(){
        const newDirection = this.direction === "row" ? "column" : "row";
        this.setDirection(newDirection);
    }

    isUnder(point){
        return isUnderPoint(point, this.div);
    }
}