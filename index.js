const baseUrl = 'https://foodish-api.herokuapp.com/api/images/';
const image = document.querySelector('.imageGame');
const allBlocks = document.querySelectorAll('.recBlocks');
const buttons = document.querySelectorAll('.btn');
let category;
let endRound = false;
let endGame = false;
const roundNumber = document.querySelector('.roundNum');
let round = 0;
let remainingBlocks = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const pointsNumber = document.querySelector('.pointsNum');
const currentPointsBar = document.querySelector('.currentPoints');
let points = 80;
const totalPointsNum = document.querySelector('.totalPointsNum');
let totalPoints = 0;
const roundBuffer = document.querySelector('.roundBuffer');
const roundButton = document.querySelector('.roundButton');
const roundMessage = document.querySelector('.roundMessage');
const roundResults = [];

// get available image from API from provided category
async function getImage(category) {
    // build url   
    const url = baseUrl + category;
    // send it
    try{
        const response = await fetch(url);
        const data = await response.json();
        const foodImage = data.image;
        image.setAttribute('style', `background-image: url(${foodImage}`);
    } catch( err) {
        console.log(err);
    }
}

// randomly pick a category and return
function getCategory(){
    const randomNum = Math.floor((Math.random() * 5)+1);
    switch(randomNum){
        case 1:
            category = "biryani";
            break;
        case 2:
            category = "burger";
            break;
        case 3:
            category = "dosa";
            break;
        case 4:
            category = "idly";
            break;
        case 5:
            category = "pizza";
            break;
    }
    return category;
}

// handles button click to check if guess was correct
function checkGuess(){
    if(endRound) return;
    const guess = this.innerText.toLowerCase();
    const winRound = guess === category? true : false;
    roundResults.push(winRound);
    if(winRound){
        totalPoints += points;
        totalPointsNum.innerText = totalPoints;
    }
    endRound = true;
    allBlocks.forEach(block => block.classList.add('hide'));
    let roundText = winRound? `<h3>Congrats!</h3><p>You were correct and earned ${points} points!` : `<h3>Sorry :(</h3><p>You were wrong and don't earn any points this round.`;
    // let endText = endGame? `You scored ${totalPoints} points!` : ``;
    let endText = '';
    let roundResultText = '';
    const humanResults = roundResults.map(result => {
        return result? `<span class="won">Won</span>` : `<span class="lost">Lost</span>`;
        });
    if(endGame){
        endText = `<h2>Overall Score</h2><p>You scored a total of <span class="endPoints">${totalPoints}</span> points!<p>`;
        roundResultText = `<h4>Round Results</h4><p class="endRounds">${humanResults.join(' : ')}</p>`;
    }
    const fullMessage = `<p>${roundText}</p><p>${endText}</p><p>${roundResultText}</p>`
    roundMessage.innerHTML = fullMessage;
    const buttonText = endGame? 'Start New Game' : 'Start Next Round';
    roundButton.innerText = buttonText;
    roundBuffer.classList.remove('hide');
}

// grabs 1 block from remaining selection
function getBlock(){
    const randomNum = Math.floor((Math.random() * remainingBlocks.length));
    number = remainingBlocks.splice(randomNum, 1)
    const block = document.querySelector(`#recBlock${number}`);
    return block;
}

// reset
function resetRound(){
    endRound = false;
    remainingBlocks = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    allBlocks.forEach(block => block.classList.remove('hide'));
    points = 80;
    pointsNumber.innerText = points;
    const barHeight = ( points / 80) * 100;
    currentPointsBar.style.height = `${barHeight}%`;
    if( round >= 5){
        endGame = true;
    }
    roundNumber.innerText = round;
    setTimeout(() => {
        getImage(getCategory());
    }, 500);
}

// periodically removes random remaining block
var removeBlocks = function(){
    if( endRound || remainingBlocks.length === 0){
        clearInterval(roundInterval);
        clearInterval(pointsInterval);
        return;
    }
    const block = getBlock();
    block.classList.add('hide');
}

// start Round
function startRound(){
    removeBlocks();
    var roundInterval = setInterval(() => {
        if( endRound || remainingBlocks.length === 0){
            clearInterval(roundInterval);
            return;
        }
        // remove blocks
        const block = getBlock();
        block.classList.add('hide');
    }, 1000);
    var pointsInterval = setInterval(() => {
        if( endRound || remainingBlocks.length === 0){
            clearInterval(pointsInterval);
            return;
        }
        // reduce points
        points = points - 1;
        pointsNumber.innerText = points;
        const barHeight = ( points / 80) * 100;
        currentPointsBar.style.height = `${barHeight}%`;
    }, 100);
}

// show intro slide/ new round
function newRound(){
    if( endGame){
        totalPoints = 0;
        totalPointsNum.innerText = 0;
        round = 0;
        roundResults.length = 0;
        endGame = !endGame;
    }
    round++;
    resetRound();
    setTimeout(startRound, 1500);
    roundBuffer.classList.add('hide');
}

// event listeners
buttons.forEach( button => button.addEventListener('click', checkGuess));
roundButton.addEventListener('click', newRound);