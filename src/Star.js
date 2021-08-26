class Star{
    div = null;
    x = null;
    y = null; 

    constructor(x, y){
        const div = document.createElement("div");
        div.classList.add("star");
        div.textContent = "*";

        Object.assign(this, { x, y, div });
    }
}