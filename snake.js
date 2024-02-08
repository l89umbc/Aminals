/**
 * Landon Jones
 * 
 * snake.js
 * 
 * script file to accompany snake html page
 */

// global elements

var boardElem = document.getElementById("board");
var scoreElem = document.getElementById("score");
var highscoreElem = document.getElementById("highscore");
var currScore = 0;
var highScore = 0;

// whole lotta constants

const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;

const PAINTS_PER_SECOND = 4;
const MS_PER_SECOND = 1000;

const WIDTH = 15;
const LENGTH_PER_SPEED = 15;
const HEIGHT = WIDTH;
const MIDDLE = Math.floor(WIDTH/2);
const GREEN = 'rgb(0, 179, 3)';
const GREY = 'rgb(56, 56, 56)';
const PINK = 'rgb(255, 0, 195)';

// globals

var direction = NORTH; 
var length = 1

var board = [];
var active = [[MIDDLE, MIDDLE]];
var eaten = false;

// get random integer
function randInt(max)
{
    return Math.floor(Math.random()*max);
}

// initialize board
for(let i = 0; i < HEIGHT; i++)
{
    let rowElem = document.createElement('div');
    rowElem.classList.add('board-row');
    let row = [];
    for(let j = 0; j < WIDTH; j++)
    {
        let space = document.createElement('div');
        row.push(space);
        rowElem.appendChild(space);
    }
    board.push(row);
    boardElem.appendChild(rowElem);
}

// change snake direction
document.addEventListener('keydown', e => {
    if(e.key == "ArrowUp" || e.key == "w")
    {
        direction = NORTH;
    }
    else if(e.key == "ArrowDown" || e.key == "s")
    {
        direction = SOUTH;
    }
    else if(e.key == "ArrowRight" || e.key == "d")
    {
        direction = EAST;
    }
    else if(e.key == "ArrowLeft" || e.key == "a")
    {
        direction = WEST;
    }
});

// start new game
function resetGame()
{
    currScore = 1;
    scoreElem.innerHTML = 'Score: 1';
    for(const coords of active)
    {
        board[coords[0]][coords[1]].style.backgroundColor = GREY;
    }
    direction = NORTH;
    active = [[MIDDLE, MIDDLE]];
}

// move the snake forward
function addSpace(direction, r, c)
{
    switch(direction)
    {
        case NORTH:
            if(r-1 < 0){r = HEIGHT;}
            if(board[r-1][c].style.backgroundColor == PINK){eaten = true;}
            if(board[r-1][c].style.backgroundColor == GREEN){return 0;}

            board[r-1][c].style.backgroundColor = GREEN;
            return [r-1, c];
        case EAST:
            if(c+1>=WIDTH){c = -1;}
            if(board[r][c+1].style.backgroundColor == PINK){eaten = true;}
            if(board[r][c+1].style.backgroundColor == GREEN){return 0;}

            board[r][c+1].style.backgroundColor = GREEN;
            return [r, c+1];
        case SOUTH:
            if(r+1>=HEIGHT){r = -1;}
            if(board[r+1][c].style.backgroundColor == PINK){eaten = true;}
            if(board[r+1][c].style.backgroundColor == GREEN){return 0;}

            board[r+1][c].style.backgroundColor = GREEN;
            return [r+1, c];
        case WEST:
            if(c-1<0){c = HEIGHT;}
            if(board[r][c-1].style.backgroundColor == PINK){eaten = true;}
            if(board[r][c-1].style.backgroundColor == GREEN){return 0;}

            board[r][c-1].style.backgroundColor = GREEN;
            return [r, c-1];
        default:
            break;
    }
}

// place food and update score
function setFood()
{
    currScore++;
    scoreElem.innerHTML = `Score: ${currScore}`;
    if(highScore < currScore)
    {
        highScore = currScore;
        highscoreElem.innerHTML = `Highscore: ${highScore}`;
    }
    let index = randInt(HEIGHT*WIDTH);
    let col = index%WIDTH;
    let row = Math.floor(index/HEIGHT);
    let j = 1;

    while(board[row][col].style.backgroundColor == GREEN)
    {
        index+= j*j;
        col = index%WIDTH;
        row = Math.floor(index/HEIGHT);
        j++;
    }
    board[row][col].style.backgroundColor = PINK;
}

// start game in the middle of the board
board[MIDDLE][MIDDLE].style.backgroundColor = GREEN;
setFood();

function move(ts, oldts)
{
    if(ts-oldts >= (MS_PER_SECOND/PAINTS_PER_SECOND) / (1 + active.length/LENGTH_PER_SPEED)) // increase speed as more food is eaten
    {
        let lastActive = active[0];
        for(let i = 0; i < active.length; i++)
        {
            if (i == active.length-1)
            {
                if(eaten)
                {
                    active.push([active[i][0], active[i][1]])
                    eaten = false;
                    setFood();
                }
                else
                {
                    board[active[i][0]][active[i][1]].style.backgroundColor = GREY;
                }
            }

            if(i == 0)
            {
                let temp = addSpace(direction, active[i][0], active[i][1]);
                if(temp == 0)
                {
                    resetGame();
                }
                else
                {
                    active[i] = temp;
                }
            }
            else
            {
                let temp = active[i];
                active[i] = lastActive;
                lastActive = temp;
            }
        }

        oldts = ts;
    }
    requestAnimationFrame((ts) => move(ts, oldts));
}

requestAnimationFrame((ts) => move(ts, 0)); // start game loop
