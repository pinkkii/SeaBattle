class Ship {
    x = null;
    y = null;

    direction = null;
    killed = false;
    size = null;

    constructor(direction, size){
        Object.assign(this, { direction, size });
        
    }


}