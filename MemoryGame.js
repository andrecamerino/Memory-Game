const tilesContainer = document.querySelector(".tiles"); // creates a variable that references the 'tiles' class
const scoreElement = document.getElementById("score"); // // creates a variable that references the 'score' ID
const images = [    // must have 9 images total for 6 by 3 layout
  "url('CardFaces/BlackBugatti.png')", 
  "url('CardFaces/BlackKoenigsegg.png')",
  "url('CardFaces/BlueMclaren.png')",
  "url('CardFaces/OrangeBlackBugatti.png')",
  "url('CardFaces/OrangeMclaren.png')",
  "url('CardFaces/RedFerarri.png')",
  "url('CardFaces/WhiteFerarri.png')",
  "url('CardFaces/WhiteLambo.png')",
  "url('CardFaces/YellowLambo.png')",
];

const imagesPickList = [...images, ...images]; // creating a variable that includes each image from image twice
const tileCount = imagesPickList.length;

// creates updateScore function: updates score then enlarges the text then shrinks it back to normal
const updateScore = (revealedCount) => {
    scoreElement.textContent = `${revealedCount / 2} Pairs Revealed`;
    scoreElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
        scoreElement.style.transform = 'scale(1)';
    }, 250);
}

let revealedCount = 0;
let activeTile = null; // creates an activeTile variable but is set to no tile (nothing)
let awaitingEndOfMove = false; // creates a variable boolean for awaitingEndOfMove: false being waiting, allowing the user to select tiles

// creates buildTile function
const buildTile = (image) => {
    const element = document.createElement('div'); // creates a variable 'element' which creates a div in the html

    element.classList.add('tile'); // appends the 'tile' class to the div element
    element.setAttribute("data-image", image); // sets the div element's attribute 'data-image' to the image passed into the buildTile function
    element.setAttribute("data-revealed", "false"); // sets the div element's attribute 'data-revealed' to false, stating that it has not been revealed aka facing down

    // creates function for when the element div is clicked
    element.addEventListener('click', () => {
        const revealed = element.getAttribute("data-revealed"); // creates 'revealed' const that is equivalent to the div element's "data-revealed" value

        if (
            awaitingEndOfMove // if awaiting end of move = first tile chose and waiting for second tile
            || revealed === 'true' // or if the div element has already been flipped
            || element === activeTile // or if the div element is currently our 'active tile'
        ) {
            return; // exit out of buildTile function
        }

        element.style.backgroundImage = `${image}`; // sets the div element's background image to the image passed into the buildTile funciton
        element.style.backgroundSize = 'contain'; // contains the image within the div element
        element.style.backgroundPosition = 'center'; // centers the image within the div element
        element.style.backgroundRepeat = 'no-repeat'; // ensures that the image doesnt repeat (create a pattern) within the div element
        element.style.backgroundColor = 'rgb(253, 240, 213)';

        // if there is active tile (flipped tile) or the activeTile we select is the same, we set the activeTile to the element we clicked and exit
        if (!activeTile || activeTile === element) {
            activeTile = element;
            return;
        }

        const imageToMatch = activeTile.getAttribute('data-image'); // creates imageToMatch constant which gets the image from the active tile (the tile we selected)

        // if image of the active tile is equal to the image of the new tile we selected
        if (imageToMatch === image) {
            activeTile.setAttribute("data-revealed", "true"); // sets 'data-revealed' for the selcted activeTile to true
            element.setAttribute("data-revealed", "true"); // sets 'data-revealed' to true for the next selected element

            awaitingEndOfMove = false; // sets to false due to images matching
            activeTile = null; // makes it so there is no active tile
            revealedCount += 2;
            updateScore(revealedCount);

            if (revealedCount === tileCount) {
                setTimeout(() => {
                    alert("You win! Reload the page to play again!"); 
                }, 1000);
            }

            return; // escape click event
        }

        // code below occurs if images do not match

        awaitingEndOfMove = true; // sets to true, so if tile is clicked again, it wont get past the first if statment in this event listener

        // unflips the selected tiles after 1000ms
        setTimeout(() => {
            element.style.backgroundImage = null;
            activeTile.style.backgroundImage = null;
            element.style.backgroundColor = 'rgb(120, 0, 0)';
            activeTile.style.backgroundColor = 'rgb(120, 0, 0)';
            awaitingEndOfMove = false; //  no longer wiating for 2nd move
            activeTile = null; // no more active tile
        }, 1000);
    });

    return element; // returns the div element
};

// for each image in the imagesPickList
for (let i = 0; i < tileCount; i++) {
    const randomIndex = Math.floor(Math.random() * imagesPickList.length); // selects a random index
    const image = imagesPickList[randomIndex]; // creates const set to random image
    const tile = buildTile(image); // builds a tile using image

    imagesPickList.splice(randomIndex, 1); // removes the chosen image from the list
    tilesContainer.appendChild(tile); // appends the tile to the tile container

    tile.style.animationDelay = `${i * 0.1}s`; // animates card after .1s for each image, staggered
}
