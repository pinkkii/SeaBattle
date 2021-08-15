class Application{
    mouse = null;
    activeScene = null;

    player = null;
    opponent = null;

    scenes = {};

    constructor(scenes = {}){
        const mouse = new Mouse(document.body);

        const player = new Battlefield();
        const opponent = new Battlefield();

        Object.assign(this, { mouse, player, opponent });
            
        document.querySelector('[data-side="player"]')
            .append(player.div);
        document.querySelector(`[data-side="opponent"]`)
            .append(opponent.div);

        for(const [sceneName, SceneClass] of Object.entries(scenes)){
            this.scenes[sceneName] = new SceneClass(sceneName, this);
        }
    
        for(const scene of Object.values(this.scenes)){
            scene.init();
        }

        requestAnimationFrame(() => this.tick());
    }

    tick(){
        requestAnimationFrame(() => this.tick());
                
        // if(this.activeScene){
        //     this.activeScene.update();
        // }
        
        this.mouse.tick();
    }
}