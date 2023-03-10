const gameStart = document.querySelector('.game-start');
const gameArea = document.querySelector('.game-area');
const gameOver = document.querySelector('.game-over');
const gameScore = document.querySelector('.game-score');
const gamePoints = gameScore.querySelector('.points')

gameStart.addEventListener('click', onGameStart);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

 
let state = initialState({
    areaWidth: gameArea.offsetWidth,
    attackWidth: 40,
    bugWidth: 60,
    bugHeight: 60,
});

function onGameStart() {
    gameStart.classList.add('hide')
    // Game started!

    const wizard = document.createElement('div');
    wizard.classList.add('wizard');
    wizard.style.top = state.player.y + 'px';
    wizard.style.left = state.player.x + 'px';
    gameArea.appendChild(wizard);
    state.player.width = wizard.offsetWidth;
    state.player.height = wizard.offsetHeight;

    state.player.w = wizard.offsetWidth;
    state.player.h =  wizard.offsetHeight;
    window.requestAnimationFrame(frame(0));
}


const frame = t1 => t2 => {
    if (t2 - t1 > game.frameLength) {
        state = next(state);
        gameAction(t2, state);
        // changing name gameAction to draw
        state.gameInfo.isActiveGame && window.requestAnimationFrame(frame(t2));  
    } else {
        window.requestAnimationFrame(frame(t1));  
    }
} 

function gameAction(timestamp, state) {
    const wizard = document.querySelector('.wizard');
    state.gameInfo.score++;

    // Add bugs
    if (timestamp - state.gameInfo.lastBugSpawn > game.buhSpawnInterval + 5000 * Math.random()) {
        let bug = document.createElement('div');
        bug.classList.add('bug');
        bug.x = gameArea.offsetWidth - 60;
        bug.style.left = bug.x + 'px';
        bug.style.top = (gameArea.offsetHeight - 60) * Math.random() + 'px';

        gameArea.appendChild(bug);
        state.gameInfo.lastBugSpawn = timestamp;

        state.bugs.push({
            x: gameArea.offsetWidth - 60,
            y: (gameArea.offsetHeight - 60) * Math.random(),
            w: bug.offsetWidth,
            h: bug.offsetHeight,
            el: bug,
        });
    }

    // Add clouds
    if (timestamp - state.gameInfo.lastCloudSpawn > game.cloudSpawnInterval + 10000 * Math.random()) {
        let cloud = document.createElement('div');
        cloud.classList.add('cloud');
        cloud.x = gameArea.offsetWidth - 200;
        cloud.style.left = cloud.x + 'px';
        cloud.style.top = (gameArea.offsetHeight - 200) * Math.random() + 'px';

        gameArea.appendChild(cloud);
        state.gameInfo.lastCloudSpawn = timestamp;
    }

    // Modify bug positions
    let bugs = document.querySelectorAll('.bug');
    // bugs.forEach(bug => {
    //     bug.x -= game.speed * 2;
    //     bug.style.left = bug.x + 'px';

    //     if (bug.x + bugs.offsetWidth <= 0) {
    //         bug.parentElement.removeChild(bug);
    //     }
    // });

    state.bugs.forEach(b => b.el.style.left = b.x + 'px');

    // Modify clouds positions
    let clouds = document.querySelectorAll('.cloud');
    clouds.forEach(cloud => {
        cloud.x -= game.speed;
        cloud.style.left = cloud.x + 'px';

        if (cloud.x + clouds.offsetWidth <= 0) {
            cloud.parentElement.removeChild(cloud);
        }
    });


    // Modify fireball positions
    let fireBalls = document.querySelectorAll('.fire-ball');

    state.attacks.forEach(a => a.el.style.left = a.x + 'px');

    // fireBalls.forEach(fireBall => {
    //     fireBall.x += game.speed * game.fireBallMultiplayer;
    //     fireBall.style.left = fireBall.x + 'px';

    //     if (fireBall.x + fireBall.offsetWidth > gameArea.offsetWidth) {
    //         fireBall.parentElement.removeChild(fireBall);
    //     }
    // });

    // Apply gravitation
    let isInAir = state.player.y + state.player.height < gameArea.offsetHeight;
    if (isInAir) {
        state.player.y += game.speed;
    }

    // Register user input
    if (keys.ArrowUp && state.player.y > 0) {
        state.player.y -= game.speed * game.movingMultiplayer;
    }
    if (keys.ArrowDown && isInAir) {
        state.player.y += game.speed * game.movingMultiplayer;
    }
    if (keys.ArrowLeft && state.player.x > 0) {
        state.player.x -= game.speed * game.movingMultiplayer;
    }
    if (keys.ArrowRight && state.player.x + state.player.width < gameArea.offsetWidth) {
        state.player.x += game.speed * game.movingMultiplayer;
    }
    // Add Fireball
    if (keys.Space && timestamp - state.player.lastTimeFiredFireball > game.fireInterval) {
        wizard.classList.add('wizard-fire');
        addFireBall(state);
        state.player.lastTimeFiredFireball = timestamp;
    } else {
        wizard.classList.remove('wizard-fire');
    }

    // Collision detection
    bugs.forEach(bug => {
        // if(isCollision(wizard, bug)) {
        //     gameOverFn();
        // }
        fireBalls.forEach(fireBall => {
            if (isCollision(fireBall, bug)) {
                state.gameInfo.score += game.bugKillBonus;
                bug.parentElement.removeChild(bug);
                // fireBall.parentElement.removeChild(fireBall);
            }
        })
    });
    

    // Apply movement
    wizard.style.top = state.player.y + 'px';
    wizard.style.left = state.player.x + 'px';

    // Apply score
    gamePoints.textContent = state.gameInfo.score;

}


