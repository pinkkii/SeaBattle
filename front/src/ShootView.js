class ShootView extends Shoot {
    div = null;

    constructor(x, y, variant = "miss") {
        super(x, y, variant);

        const div = document.createElement("div");
        div.classList.add("shot");

        Object.assign(this, { div, x, y, variant });
        
        this.setVariant(variant, true);
    }

    setVariant(variant, force = false){
        if(!force && this.variant === variant){
            return false;
        }

        this.variant = variant;
        
        this.div.classList.remove("shot-missed", "shot-wounded", "shot-killed");
        this.div.textContent = "";

        if(this.variant === "miss"){
            this.div.classList.add("shot-missed");
            this.div.textContent = "•";
            this.div.style.fontSize = `40px`;
        } else if (this.variant === "wounded") {
            this.div.classList.add("shot-wounded");
        } else if (this.variant === "killed") {
            this.div.classList.add("shot-killed", "shot-wounded");
        }

        return true;
    }
}