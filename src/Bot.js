class Bot{
    player = null;

    isSunkFirst = false;
    isSunkSecond = false;
    isSunkThird = false;
    isSunkFourth = false;

    x = null;
    y = null;
    pX = null;
    pY = null;
    startX = null;
    startY = null;

    item = null;
    miss = false;

    constructor(player){
        this.player = player;
    }

    ShootBot(){
        if (!this.isSunkFirst && !this.isSunkSecond && !this.isSunkThird && !this.isSunkFourth) {
            this.isSunkOne();
        }

        if(this.isSunkFirst && !this.isSunkSecond){
            this.isSunkTwo();
        }

        if(this.isSunkSecond && !this.isSunkThird){
            this.isSunkThree();
        }

        if (this.isSunkThird && !this.isSunkFourth) {
            this.isSunkFour();
        }

        if (this.isSunkFourth) {
            this.discharge();
        }

    }

    isSunkOne(){
        let shoted = false;
            
        this.startX = null;
        this.startY = null;
        this.discharge();

        while (shoted === false) {
            this.x = getRandomBetween(0,9);
            this.y = getRandomBetween(0,9);
    
            this.item = this.player._private_matrix[this.y][this.x];

            let x = this.x;
            let y = this.y;
    
            if (this.item.shoot) {
                shoted = false;
            } else {
                shoted = true;
                const shoot = new Shoot(x, y);
                this.player.addShoot(shoot);
                console.log("shoot 1 ПАЛУБА: ",y,x);
            }
        }
        
        this.pX = this.x;
        this.pY = this.y;

        if (this.item.ship && !this.item.ship.killed) {
            this.isSunkFirst = true;
            this.startX = this.x;
            this.startY = this.y;
            console.log("Выстрел в первую палубу");
        }

        if (!this.item.ship) {
            this.miss = true;
            console.log("Промах",this.y, this.x);
        }

        if(this.item.ship && this.item.ship.killed){
            console.log("ЕСЛИ УБИТ ОДНОПАЛУБНИК");
            this.isSunkOne();
        }
    }

    isSunkTwo(){
        this.miss = false;
        let temp = false;

        this.pX = this.x;
        this.pY = this.y;
        while (!temp) {
            let coord = getRandomBetween(0,3);

            switch(coord){
                case 0:
                    if (this.y === 0) {
                        temp = false;
                    } else {
                        let x = this.x;
                        let y = this.y - 1;

                        this.item = this.player._private_matrix[y][x];

                        if(!this.item.shoot && !this.item.star)
                        {
                            const shoot = new Shoot(x, y);
                            this.player.addShoot(shoot);    
    
                            Object.assign(this, { x, y });
                            temp = true;
                            console.log("shoot 2 ПАЛУБА: ",y,x);
                            console.log("Выстрел по второй палубе ВВЕРХ");
                        }
                    }
                    break;
                case 1:
                    if (this.x === 9) {
                        temp = false;
                    } else {
                        let x = this.x + 1;
                        let y = this.y;

                        this.item = this.player._private_matrix[y][x];

                        if(!this.item.shoot && !this.item.star)
                        {
                            const shoot = new Shoot(x, y);
                            this.player.addShoot(shoot);    
    
                            Object.assign(this, { x, y });
                            temp = true;
                            console.log("shoot 2 ПАЛУБА: ",y,x);
                            console.log("Выстрел по второй палубе ВПРАВО");
                        }
                    }
                    break;
                case 2:
                    if (this.y === 9) {
                        temp = false;
                    } else {
                        let x = this.x;
                        let y = this.y + 1;

                        this.item = this.player._private_matrix[y][x];

                        if(!this.item.shoot && !this.item.star)
                        {
                            const shoot = new Shoot(x, y);
                            this.player.addShoot(shoot);    
    
                            Object.assign(this, { x, y });
                            temp = true;
                            console.log("shoot 2 ПАЛУБА: ",y,x);
                            console.log("Выстрел по второй палубе ВНИЗ");
                        }
                    }
                    break;
                case 3:
                    if (this.x === 0) {
                        temp = false;
                    } else {
                        let x = this.x - 1;
                        let y = this.y;

                        this.item = this.player._private_matrix[y][x];

                        if(!this.item.shoot && !this.item.star)
                        {
                            const shoot = new Shoot(x, y);
                            this.player.addShoot(shoot);    
    
                            Object.assign(this, { x, y });
                            temp = true;
                            console.log("shoot 2 ПАЛУБА: ",y,x);
                            console.log("Выстрел по второй палубе ВЛЕВО");
                        }
                    }
                    break;
                default:
                    console.log("isSunkTwo default");
                    break;
            }
        }

        if (this.item.ship && !this.item.ship.killed) {
            this.isSunkSecond = true;
            console.log("isSunkSecond = true");
        }

        if(!this.item.ship){
            this.updateCoord();
            this.miss = true;
            console.log("Промах",this.y,this.x);
        }

        if(this.item.ship && this.item.ship.killed) {
            console.log("ЕСЛИ УБИТ КОРАБЛЬ");
            this.isSunkOne();
        }
    }
    
    isSunkThree(){
        let temp = false;
        this.miss = false;

        this.pX = this.x;
        this.pY = this.y;

        let Direction = this.player._private_matrix[this.startY][this.startX].ship.direction;

        while (!temp) {
            let coord = getRandomBetween(0,1);

            switch(coord){
                case 0:
                    if (Direction === "row") {
                        if (this.x === 9) {
                            temp = false;
                        } else{
                            let x = this.x + 1;
                            let y = this.y;
    
                            this.item = this.player._private_matrix[y][x];
    
                            if(!this.item.shoot && !this.item.star)
                            {
                                const shoot = new Shoot(x, y);
                                this.player.addShoot(shoot);    
        
                                Object.assign(this, { x, y });
                                temp = true;
                                console.log("shoot 3 ПАЛУБА: ",y,x);
                                console.log("Выстрел по третей палубе ВПРАВО");
                            }
                        }
                    }
                    if (Direction === "column") {
                        if (this.y === 0) {
                            temp = false;
                        } else{
                            let x = this.x;
                            let y = this.y - 1;
    
                            this.item = this.player._private_matrix[y][x];
    
                            if(!this.item.shoot && !this.item.star)
                            {
                                const shoot = new Shoot(x, y);
                                this.player.addShoot(shoot);    
        
                                Object.assign(this, { x, y });
                                temp = true;
                                console.log("shoot 3 ПАЛУБА: ",y,x);
                                console.log("Выстрел по третей палубе ВВЕРХ");
                            }
                        }
                    }
                    break;
                case 1:
                    if (Direction === "row") {
                        if (this.x === 0) {
                            temp = false;
                        } else{
                            let x = this.x - 1;
                            let y = this.y;
    
                            this.item = this.player._private_matrix[y][x];
    
                            if(!this.item.shoot && !this.item.star)
                            {
                                const shoot = new Shoot(x, y);
                                this.player.addShoot(shoot);    
        
                                Object.assign(this, { x, y });
                                temp = true;
                                console.log("shoot 3 ПАЛУБА: ",y,x);
                                console.log("Выстрел по третей палубе ВЛЕВО");
                            }
                        }
                    }
                    if (Direction === "column") {
                        if (this.y === 9) {
                            temp = false;
                        } else{
                            let x = this.x;
                            let y = this.y + 1;
    
                            this.item = this.player._private_matrix[y][x];
    
                            if(!this.item.shoot && !this.item.star)
                            {
                                const shoot = new Shoot(x, y);
                                this.player.addShoot(shoot);    
        
                                Object.assign(this, { x, y });
                                temp = true;
                                console.log("shoot 3 ПАЛУБА: ",y,x);
                                console.log("Выстрел по третей палубе ВНИЗ");
                            }
                        }
                    }
                    break;
                default:
                    console.log("isSunkTwo default");
                    break;
            }
        }

        if (this.item.ship && !this.item.ship.killed) {
            this.isSunkThird = true;
            console.log("isSunkThird = true");
        }

        if(!this.item.ship){
            this.miss = true;
            console.log("Промах",this.y,this.x);
            this.x = this.startX;
            this.y = this.startY;
        }

        if(this.item.ship && this.item.ship.killed) {
            console.log("ЕСЛИ УБИТ КОРАБЛЬ");
            this.isSunkOne();
        }
    }

    isSunkFour(){
        let temp = false;

        this.miss = false;
        
        this.pX = this.x;
        this.pY = this.y;
        let Direction = this.player._private_matrix[this.startY][this.startX].ship.direction;

        while (!temp) {
            let coord = getRandomBetween(0,1);

            switch(coord){
                case 0:
                    if (Direction === "row") {
                        if (this.x === 9) {
                            temp = false;
                        } else{
                            let x = this.x + 1;
                            let y = this.y;
    
                            this.item = this.player._private_matrix[y][x];
    
                            if(!this.item.shoot && !this.item.star)
                            {
                                const shoot = new Shoot(x, y);
                                this.player.addShoot(shoot);    
        
                                Object.assign(this, { x, y });
                                temp = true;
                                console.log("shoot 4 ПАЛУБА: ",y,x);
                                console.log("Выстрел по 4 палубе ВПРАВО");
                            }
                        }
                    }
                    if (Direction === "column") {
                        if (this.y === 0) {
                            temp = false;
                        } else{
                            let x = this.x;
                            let y = this.y - 1;
    
                            this.item = this.player._private_matrix[y][x];
    
                            if(!this.item.shoot && !this.item.star)
                            {
                                const shoot = new Shoot(x, y);
                                this.player.addShoot(shoot);    
        
                                Object.assign(this, { x, y });
                                temp = true;
                                console.log("shoot 4 ПАЛУБА: ",y,x);
                                console.log("Выстрел по 4 палубе ВВЕРХ");
                            }
                        }
                    }
                    break;
                case 1:
                    if (Direction === "row") {
                        if (this.x === 0) {
                            temp = false;
                        } else{
                            let x = this.x - 1;
                            let y = this.y;
    
                            this.item = this.player._private_matrix[y][x];
    
                            if(!this.item.shoot && !this.item.star)
                            {
                                const shoot = new Shoot(x, y);
                                this.player.addShoot(shoot);    
        
                                Object.assign(this, { x, y });
                                temp = true;
                                console.log("shoot 4 ПАЛУБА: ",y,x);
                                console.log("Выстрел по 4 палубе ВЛЕВО");
                            }
                        }
                    }
                    if (Direction === "column") {
                        if (this.y === 9) {
                            temp = false;
                        } else{
                            let x = this.x;
                            let y = this.y + 1;
    
                            this.item = this.player._private_matrix[y][x];
    
                            if(!this.item.shoot && !this.item.star)
                            {
                                const shoot = new Shoot(x, y);
                                this.player.addShoot(shoot);    
        
                                Object.assign(this, { x, y });
                                temp = true;
                                console.log("shoot 4 ПАЛУБА: ",y,x);
                                console.log("Выстрел по 4 палубе ВНИЗ");
                            }
                        }
                    }
                    break;
                default:
                    console.log("isSunkTwo default");
                    break;
            }
        }

        if(!this.item.ship){
            console.log("Промах",this.y,this.x);
            this.miss = true;
            this.x = this.startX;
            this.y = this.startY;
        }

        if(this.item.ship && this.item.ship.killed) {
            console.log("ЕСЛИ УБИТ КОРАБЛЬ");
            this.miss = false;
            this.isSunkOne();
        }
    }

    discharge(){
        this.isSunkFirst = false;
        this.isSunkSecond = false;
        this.isSunkThird = false;
        this.isSunkFourth = false;

        this.x = null;
        this.y = null;
        this.item = null;
        this.miss = false;
    }

    updateCoord(){
        this.x = this.pX;
        this.y = this.pY;
    }
}