let keys = {};

const initialState = ({
    areaWidth,
}) => ({
    player: {
        x: 150,
        y: 100,
        width: 0,
        height: 0,
        lastTimeFiredFireball: 0,
    },
    gameInfo: {
        isActiveGame: true,
        score: 0,
        lastCloudSpawn: 0,
        lastBugSpawn: 0,
        areaWidth,
        attackWidth: 40,
        attackHeight: 40,
    },
    clouds: [],
    attacks: [],
    bugs: [],
});


const nextPlayer = (state) => state.player;
const nextGameInfo = (state) => state.gameInfo;
const nextClouds = (state) => state.clouds;
const nextAttacks = (state) => state.attacks
.filter(a => {
    if(a.x + state.gameInfo.attackWidth > state.gameInfo.areaWidth) {
        a.el.parentElement.removeChild(a.el);
        return false;
    }
    return true;
})
.map(a => ({...a, x: a.x += game.speed * game.fireBallMultiplayer}));
const nextBugs = (state) => state.bugs;

const next = (state) => ({
    player: nextPlayer(state),
    gameInfo: nextGameInfo(state),
    clouds: nextClouds(state),
    attacks: nextAttacks(state),
    bugs: nextBugs(state),
});


function isCollision(firstElement, secondElement) {
    let firstRec = firstElement.getBoundingClientRect();
    let secondRec = secondElement.getBoundingClientRect();

    return !(firstRec.top > secondRec.bottom ||
             firstRec.bottom < secondRec.top ||
             firstRec.right < secondRec.left ||
             firstRec.left > secondRec.right)
}
 
function gameOverFn() {
    state.gameInfo.isActiveGame = false;
    gameOver.classList.remove('hide');
}

function addFireBall(state) {
    let fireBall = document.createElement('div');
    fireBall.classList.add('fire-ball')
    fireBall.style.top = (state.player.y + state.player.height / 3 - 5) + 'px';
    fireBall.x = state.player.x + state.player.width;
    fireBall.style.left = fireBall.x + 'px';

    state.attacks.push({
        x: state.player.x,
        y: state.player.y + state.player.height / 3 - 5,
        el: fireBall,
    });

    gameArea.appendChild(fireBall);
}


function onKeyDown(event) {
    event.preventDefault();
    keys[event.code] = true;
    console.log(keys);
}

function onKeyUp(event) {
    keys[event.code] = false;
}