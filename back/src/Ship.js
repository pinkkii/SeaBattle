module.exports = class Ship {
    x = null;
    y= null;

    direction = null;
    size = null;

    killed = false;
    stars = false;

    get placed(){
        return this.x !== null && this.y !== null;
    }
    
    constructor(size, direction){
        this.size = size;
        this.direction = direction;
    }
}