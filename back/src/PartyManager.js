const Party = require("./Party");   // Импорт(старый синтаксис)

module.exports = class PartyManager{
    players = [];
    parties = [];

    waitingRandom = [];              // Масив ожидающих случайных игроков

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