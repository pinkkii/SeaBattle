class PartyManager{
    players = [];
    parties = [];

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

        return true;
    }

    removeAllPlayers() {
        const players = this.players.slice();

        for (const player of players) {
            this.removePlayer(player);
        }

        return players.length;
    }

    addParty(party) {}

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
}