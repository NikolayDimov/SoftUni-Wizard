let game = {
    speed: 2,
    frameLength: 30,
    movingMultiplayer: 3,
    fireBallMultiplayer: 4,
    fireInterval: 1000,
    cloudSpawnInterval: 3000,
    buhSpawnInterval: 1000,
    bugKillBonus: 2000,
};

const removeEl = e => e.parentElement.removeChild(e);

const isCol = (firstRec, secondRec) => 
    !(firstRec.y > secondRec.y - secondRec.h ||
    firstRec.y - firstRec.h < secondRec.y ||
    firstRec.x + firstRec.w < secondRec.x ||
    firstRec.x > secondRec.x + secondRec.w);