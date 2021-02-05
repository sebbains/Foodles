const baseUrl = 'https://foodish-api.herokuapp.com/api/images/';
const image = document.querySelector('.imageGame');
const buttons = document.querySelectorAll('.btn');
let category;
let endGame = false;

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
    const guess = this.innerText.toLowerCase();
    const result = guess === category? 'win' : 'lose';
    console.log(result);
}

// 
function getBlock(){
    const randomNum = Math.floor((Math.random() * 9)+1);
    const block = document.querySelector(`#recBlock${randomNum}`);
    return block;
}

// periodically removes random block
function removeBlocks(){
    setInterval(() => {
        if(endGame) return;
        const block = getBlock();
        if(block.classList.contains('hide')){
            console.log("matched")
            getBlock();;
        }else{
            block.classList.add('hide');
            console.log("removed")
        }
    }, 3000);
}

// startup image
getImage(getCategory());
// event listeners
buttons.forEach( button => button.addEventListener('click', checkGuess));