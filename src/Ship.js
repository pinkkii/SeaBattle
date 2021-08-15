class Ship {
    startX = null;
    startY = null;

    x = null;
    y= null;

    direction = null;
    killed = false;
    size = null;
    div = null;

    constructor(size, direction, startX, startY){
        const div = document.createElement("div");
        div.classList.add("ship");

        Object.assign(this, { direction, size, startX, startY, div });

        this.setDirection();
    }

    setDirection(){
        this.div.classList.add(`ship-${this.direction}-${this.size}`);
        return true;
    }

}