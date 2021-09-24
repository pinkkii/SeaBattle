function isUnderPoint(point, element){
    const { left, top, width, height } = element.getBoundingClientRect();
    const { x, y } = point;
    
    return left <= x && x <= left + width && top <= y && y <= top + height;
}

function getRandomBetween(min, max){
    return min + Math.floor(Math.random() * (max - min + 1));
}

function getRandomDirection(){
    let randNum = Math.floor(Math.random() * 2);

    return (randNum === 0 ? "row" : "column");
}

function addListener(element, ...args){
    element.addEventListener(...args);
    return () => element.removeEventListener(...args); 
}