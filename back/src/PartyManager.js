const Player = require("./Player");
const Party = require("./Party");   // Импорт(старый синтаксис)
const Ship = require("./Ship");

module.exports = class PartyManager{
    players = [];
    parties = [];

    waitingRandom = [];              // Масив ожидающих случайных игроков

    connection(socket) {
        // TODO: indefinity user
        const player = new Player(socket);
        this.players.push(player);

        socket.on("shipSet", (ships ) => {
            if (this.waitingRandom.includes(player)) {
                console.log("11");
                return;
            }

            if (player.party) {
                console.log("22");
                return;
            }

            player.battlefield.clear();

            for(const { size, direction, x, y } of ships) {
                const ship = new Ship(size, direction);
                player.battlefield.addShip(ship, x, y);
            }
        });

        socket.on("findRandomOpponent", () => {
            if (this.waitingRandom.includes(player)) {
                console.log("1");
                return;
            }

            if (player.party) {
                console.log("2");
                return;
            }

            this.waitingRandom.push(player);
            console.log("asd");
            player.emit("statusChange", "randomFinding");

            if (this.waitingRandom.length >= 2) {
                const [player1, player2] = this.waitingRandom.splice(0,2);
                const party = new Party(player1, player2);
                this.parties.push(party);
            }
        }); 
    }

    disconnect(socket) {

    }

    addPlayer(player) {
        if (this.players.includes(player)) {
            return false;
        }

        this.players.push(player);

        return true;
    }

    removePlayer(player) {
        if (!this.players.includes(player)) {
            return false;
        }

        const index = this.players.indexOf(player);
        this.players.splice(index, 1);

        if (this.waitingRandom.includes(player)) { 
            const index = this.waitingRandom.indexOf(player);
            this.waitingRandom.splice(index, 1);
        }

        return true;
    }

    removeAllPlayers() {
        const players = this.players.slice();

        for (const player of players) {
            this.removePlayer(player);
        }

        return players.length;
    }

    addParty(party) {
        if (this.parties.includes(party)) {
            return false;
        }

        this.parties.push(party);

        return true;
    }

    removeParty(party) {
        if (!this.parties.includes(party)) {
            return false;
        }

        const index = this.parties.indexOf(party);
        this.parties.splice(index, 1);

        return true;
    }

    removeAllParties() {
        const parties = this.parties.slice();

        for (const party of parties) {
            this.removeParty(party);
        }

        return parties.length;
    }

    playRandom(player) {
        if (this.waitingRandom.includes(player)) {
            return false;
        }

        this.waitingRandom.push(player);

        if (this.waitingRandom.length >= 2) {
            const [player1, player2] = this.waitingRandom.splice(0,2);
            const party = new Party(player1, player2);
            this.addParty(party);
        }

        return true;
    }
}