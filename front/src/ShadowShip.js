class ShadowShip extends Ship{
    x = null;
    y = null;
    direction = null;
    size = null;
    div = null;

    constructor(size, direction){
        super(size, direction);
        const div = document.createElement("div");
        div.classList.add("ship");

        this.div = div;

        this.setDirection(direction, true);
    }

}