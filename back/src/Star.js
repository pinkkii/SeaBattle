module.exports = class Star{
    x = null;
    y = null; 
    
    constructor(x, y){
        Object.assign(this, { x, y });
    }
}