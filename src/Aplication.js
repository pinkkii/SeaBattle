class Application{
    activeScene = null;

    player = null;
    opponent = null;

    constructor(){
        const player = new Battlefield();
        const opponent = new Battlefield(); 

        Object.assign(this, { player, opponent });
            
        document.querySelector('[data-side="player"]')
            .append(player.div);
        document.querySelector(`[data-side="opponent"]`)
            .append(opponent.div);
    }

}