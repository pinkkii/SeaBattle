function isUnderPoint(point, element){
    const { left, top, width, height } = element.getBoundingClientRect();
    const { x, y } = point;
    
    return left <= x && x <= left + width && top <= y && y <= top + height;
}