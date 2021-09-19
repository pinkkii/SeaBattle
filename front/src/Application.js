class Application{
    mouse = null;
    activeScene = null;

    player = null;
    opponent = null;
    bot = null

    scenes = {};

    constructor(scenes = {}){
        const mouse = new Mouse(document.body);

        const player = new Battlefield(true);
        const opponent = new Battlefield();

        let bot = new Bot(player);

        Object.assign(this, { mouse, player, opponent, bot });
            
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
                
        if(this.activeScene){
            this.activeScene.update();
        }
        
        this.mouse.tick();
    }

    start(sceneName, ...args){
        if(this.activeScene && this.activeScene.name === sceneName){
            return false;
        }
        if(!this.scenes.hasOwnProperty(sceneName)){
            return false;
        }

        if(this.activeScene){
            this.activeScene.stop();
        }

        const scene = this.scenes[sceneName];
        this.activeScene = scene;
        scene.start(...args);
        
        return true;
    }
}