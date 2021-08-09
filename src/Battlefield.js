class Battlefield {
    table = null;
    div = null;

    ships = [];
    shoots = [];

    constructor(){
        const table = document.createElement("table");
        const div = document.createElement("div");
        div.classList.add(".battlefiled");

        this.table = table;
        this.div = div;

        for(let y = 0; y < 10; y++){
            let tr = document.createElement("tr");
            tr.dataset.y = y;
            for (let x = 0; x < 10; x++) {
                let td = document.createElement("td");
                td.dataset.y = y;
                td.dataset.x = x;
                tr.append(td);
            }
            table.append(tr);
        }

        div.append(table);

    }

}