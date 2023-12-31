const restartButton = document.getElementById('RestartButton');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resolution = 100;
canvas.width = 1500;
canvas.height = 3000;
const cols = canvas.width / resolution;
const rows = canvas.height / resolution;
const mines = 80;
let numbers = (cols * rows) - mines;
let trys = 0;
let win = false;
let lose = false;

// Create 2D array
let mainGrid = Array(cols).fill().map(() => Array(rows).fill(0));


const startGame = () => {
    mainGrid = Array(cols).fill().map(() => Array(rows).fill(0));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#dadada';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    creatMineArray(rows, cols)
    updateGrid()
    drawGrid()
    drawGrid()
    restartButton.innerText = "Restart"
    trys = 0
    win = false;
    lose = false;
}

restartButton.addEventListener('click', function () {
    startGame()
});


const mouseClick = (event) => {

    if (win || lose) {
        return;
    }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width; // Scale to match the canvas size
    const scaleY = canvas.height / rect.height; // Scale to match the canvas size

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const xx = Math.floor(x / resolution)
    const yy = Math.floor(y / resolution)

    console.log(mainGrid[xx][yy]);

    drawRect(xx, yy)
}

canvas.addEventListener('click', mouseClick);



const drawGrid = () => {
    ctx.strokeStyle = 'black';
    for (let i = 0; i < cols; i++) {
        // Draw vertical line
        const x = i * resolution;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let j = 0; j < rows; j++) {
        // Draw horizontal line
        const y = j * resolution;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

const drawRect = (x, y) => {
    const num = mainGrid[x][y]

    switch (num) {
        case 10:
            gameOver();
            break;
        case 0:
            mainGrid[x][y] = 9
            drawEmptyRect(x * resolution, y * resolution);
            revealEmpty(x, y);
            trys++
            console.log(`the numbers are ${numbers} and the trys are  ${trys}`);
            break;
        case 9:
            console.log("Do nothing");
            break;
        default:
            mainGrid[x][y] = 9
            drawNumber(num, x * resolution, y * resolution);
            trys++
            console.log(`the numbers are ${numbers} and the trys are  ${trys}`);

    }

    if (trys === numbers) {
        winGame()
    }
}

const winGame = () => {
    win = true
    restartButton.innerText = "You Win"
}

const gameOver = () => {
    lose = true;
    restartButton.innerText = "Game Over"
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = i * resolution;
            const y = j * resolution;
            if (mainGrid[i][j] === 10) {
                drawMine(x, y);
                ctx.fillStyle = 'red';
                ctx.fillRect(x, y, resolution, resolution);
                ctx.strokeStyle = 'black';
                ctx.strokeRect(x, y, resolution, resolution);
            }
        }
    }
}


const creatMineArray = (rows, cols) => {
    let mcount = mines
    while (mcount) {
        let x = Math.floor(Math.random() * (cols));
        let y = Math.floor(Math.random() * (rows));
        console.log(x, y);
        if (mainGrid[x][y] != 10) {
            mainGrid[x][y] = 10;
            mcount--;
        }

    }
    console.log("Mines added");
};



const updateGrid = () => {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const cell = mainGrid[i][j];
            if (cell === 10)
                increaseNeighbors(mainGrid, i, j)
        }
    }
}

const increaseNeighbors = (grid, x, y) => {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let col = (i + x);
            let row = (j + y);
            if (!(col < 0 || row < 0 || col >= cols || row >= rows)) {
                if (grid[col][row] !== 10) {
                    grid[col][row]++
                }

            }
        }
    }
}

drawNumber = (num, posx, posy) => {

    ctx.clearRect(posx, posy, resolution, resolution);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(posx, posy, resolution, resolution);
    // Set font and text properties
    const fontSize = 50;
    ctx.font = `900 ${fontSize}px Arial`;

    switch (num) {
        case 1:
            ctx.fillStyle = 'blue';
            break;
        case 2:
            ctx.fillStyle = 'green';
            break;
        case 3:
            ctx.fillStyle = 'red';
            break;
        case 4:
            ctx.fillStyle = 'darkblue';
            break;
        case 5:
            ctx.fillStyle = 'cyan';
            break;
        case 6:
            ctx.fillStyle = 'brown';
            break;
        case 7:
            ctx.fillStyle = 'black';
            break;
        case 8:
            ctx.fillStyle = 'purple';
            break;

    }
    // Draw the number on the canvas
    ctx.fillText(num.toString(), posx + 35, posy + 65);
    drawGrid();
}

const revealEmpty = (x, y) => {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let col = x + i;
            let row = y + j;
            if (!(col < 0 || row < 0 || col >= cols || row >= rows)) {
                drawRect(col, row)
            }
        }
    }
}


drawEmptyRect = (posx, posy) => {
    ctx.clearRect(posx, posy, resolution, resolution);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(posx, posy, resolution, resolution);
}

drawMine = (posx, posy) => {

    const minesSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" width="80px" height="80px"><path d="M90,47.5L85,47.5L85,45L79.577,45C78.812,40.443,77.02,36.237,74.447,32.624L78.284,28.787L76.516,27.019L80.052,23.483L76.516,19.947L72.98,23.483L71.212,21.715L67.375,25.552C63.761,22.979,59.555,21.187,54.999,20.422L54.999,15L52.499,15L52.499,10L47.499,10L47.499,15L45,15L45,20.423C40.443,21.188,36.237,22.98,32.624,25.553L28.787,21.716L27.019,23.484L23.483,19.948L19.947,23.484L23.483,27.02L21.715,28.788L25.552,32.625C22.979,36.239,21.187,40.445,20.422,45.001L15,45.001L15,47.501L10,47.501L10,52.501L15,52.501L15,55L20.423,55C21.188,59.557,22.98,63.763,25.553,67.376L21.716,71.213L23.484,72.981L19.948,76.517L23.484,80.053L27.02,76.517L28.788,78.285L32.625,74.448C36.239,77.021,40.445,78.813,45.001,79.578L45.001,85L47.501,85L47.501,90L52.501,90L52.501,85L55,85L55,79.577C59.557,78.812,63.763,77.02,67.376,74.447L71.213,78.284L72.981,76.516L76.517,80.052L80.053,76.516L76.517,72.98L78.285,71.212L74.448,67.375C77.021,63.761,78.813,59.555,79.578,54.999L85,54.999L85,52.499L90,52.499L90,47.5ZM50,25L50,30C38.972,30,30,38.972,30,50L25,50C25,36.215,36.215,25,50,25Z" stroke="none"></path></svg>`

    // Create a new Image object
    const img = new Image();

    // Set the source of the image to a data URL of the SVG
    img.src = 'data:image/svg+xml,' + encodeURIComponent(minesSVG);

    // Draw the image on the canvas when it's loaded
    img.onload = function () {
        ctx.drawImage(img, posx + 10, posy + 10);
    };
}

const revealGrid = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(cols, rows);
    console.log(mainGrid);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = i * resolution;
            const y = j * resolution;
            if (mainGrid[i][j] === 10) {
                drawMine(x, y);
            }
            else if (mainGrid[i][j] !== 0) {
                drawNumber(mainGrid[i][j], x, y)
            } else {
                drawNumber(mainGrid[i][j], x, y)
            }
            ctx.strokeStyle = 'black';
            ctx.strokeRect(x, y, resolution, resolution);
        }
    }
}


window.onload = function () {
    startGame()
};
