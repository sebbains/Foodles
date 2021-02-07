const baseUrl = 'https://foodish-api.herokuapp.com/api/images/';
const image = document.querySelector('.imageGame');
const allBlocks = document.querySelectorAll('.recBlocks');
const buttons = document.querySelectorAll('.btn');
let category;
let endRound = false;
let endGame = false;
const roundNumber = document.querySelector('.roundNum');
let round = 1;
let remainingBlocks = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const pointsNumber = document.querySelector('.pointsNum');
let points = 100;
const totalPointsNum = document.querySelector('.totalPointsNum');
let totalPoints = 0;

// get available image from API from provided category
async function getImage(category) {
    // build url   
    const url = baseUrl + category;
    // send it
    try{
        const response = await fetch(url);
        const data = await response.json();
        const foodImage = data.image;
        console.log(category);
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
    if(winRound){
        totalPoints += points;
        totalPointsNum.innerText = totalPoints;
    }
    endRound = true;
    allBlocks.forEach(block => block.classList.add('hide'));
    console.log(`did you win? : ${winRound}`);
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
    getImage(getCategory());
    allBlocks.forEach(block => block.classList.remove('hide'));
    points = 100;
    pointsNumber.innerText = points;
    round++;
    roundNumber.innerText = round;
}

// periodically removes random block
var removeBlocks = function(){
    if( endRound || remainingBlocks.length === 0){
        clearInterval(startRound);
        return;
    }
    const block = getBlock();
    block.classList.add('hide');
}

// start coutdown
function startCountdown(){
    setInterval(() => {
        if( points <= 0 || endRound) {
            return;
        }
        points = points - 10;
        pointsNumber.innerText = points;
    }, 1000);
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
        // reduce points
        points = points - 10;
        pointsNumber.innerText = points;
    }, 1000);
}

// start Game
function startGame(){
    getImage(getCategory());
    startRound();
}

// event listeners
buttons.forEach( button => button.addEventListener('click', checkGuess));