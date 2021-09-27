class StarView extends Star {
    div = null;

    constructor(x, y) {
        super(x, y);
        const div = document.createElement("div");
        div.classList.add("star");
        div.textContent = "•";

        this.div = div;
    }
}