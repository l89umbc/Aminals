/**
 * Landon Jones
 * 
 * frog.js
 * 
 * script file to accompany frog html page
 */

// global elements
var frog = document.getElementById("frog");
var frogJump = document.getElementById("frog-jump");
var frogShadow = document.getElementById("frog-shadow");

// globals
var frogX = -150;
var frogY = -150;
var frogHeight = frog.clientHeight;
var frogWidth = frog.clientWidth;
var flying = false;
var hit = false;

// move frog off screen
function resetFrog()
{
    frogX = -150;
    frogY = -150;
    frog.style.left = `${frogX}px`;
    frog.style.top = `${frogY}px`;
    frogJump.style.left = `${frogX}px`;
    frogJump.style.top = `${frogY}px`;
}

// so that user can't move the frog off a lily
window.addEventListener("resize", e => {
    resetFrog();
});

// button event to recognize correct frog location
function lilyHit()
{
    if(flying){return;}
    hit = true;   
}

// the actual event to start frog jump
function clickEvent(e)
{
    flying = true;
    finX = e.clientX - frogWidth/2;
    finY = e.clientY - frogHeight/2;
    
    frog.style.opacity = "0%";
    frog.style.left = `${finX}px`;
    frog.style.top = `${finY}px`;
    
    frogJump.style.opacity = "100%";
    frogJump.style.rotate = `${Math.atan2(frogY-finY, frogX-finX) - Math.PI/2}rad`;

    fly(frogX, frogY, finX, finY, (finX-frogX)/60, (finY-frogY)/60);
}

// the actual event to start frog jump
document.addEventListener("click", e => {
    if(flying){return;}
    clickEvent(e);
});

document.addEventListener("touchend", e => {
    if(flying){return;}
    clickEvent(e);
});

// puddle animation
function puddle(currOpac)
{
    frogShadow.style.opacity = `${currOpac}%`;
    if(currOpac > 0)
    {
        currOpac-=1;
        requestAnimationFrame(()=>puddle(currOpac));
    }
}

// frog jump animation
function fly(currX, currY, finX, finY, incX, incY)
{
    currX += incX;
    currY += incY;
    frogJump.style.left = `${currX}px`;
    frogJump.style.top = `${currY}px`;
    if((currX >= finX && incX >= 0) || (currX <= finX && incX <= 0))
    {
        if((currY >= finY && incY >= 0) || (currY <= finY && incY <= 0))
        {
            frogJump.style.opacity = "0%";
            if(hit)
            {
                hit = false;
                frog.style.opacity = "100%";
                frogX = finX;
                frogY = finY;
            }
            else
            {
                frogShadow.style.left = `${finX+frogWidth/4}px`;
                frogShadow.style.top = `${finY+frogHeight/4}px`;
                frogShadow.style.opacity = "100%";
                resetFrog();
                puddle(50);
            }
            flying = false;
        }
        else
        {
            requestAnimationFrame(() => fly(currX, currY, finX, finY, incX, incY));
        }
    }
    else
    {
        requestAnimationFrame( () => fly(currX, currY, finX, finY, incX, incY));
    }
}
