const Battlefield = require("./Battlefield");

module.exports = class Player {
    socket = null;
    party = null;
    battlefield = new Battlefield();

    get ready() {
        return this.battlefield.complete && !this.party && this.socket;
        
        // if(!this.battlefield.complete) {
        //     return false;
        // }

        // if (this.party) {
        //     return false;
        // }

        // if(!this.socket) {
        //     return false;
        // }

        // return true;
    }
    constructor(socket) {
        this.socket = socket;
    }

    emit(...args) {
        if (this.socket && this.socket.connected) {
            this.socket.emit(...args);
        }
    }
}