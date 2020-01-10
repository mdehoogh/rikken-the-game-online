var infoElement=document.getElementById('info');
function setInfo(info){
    if(!info)return;
    console.log("Rikken - het spel >>> info: "+info);
    if(infoElement)infoElement.innerHTML=info;
}
function clearInfo(){if(infoElement)infoElement.innerHTML="";}

function showGameState(state){
    let colonPos=document.title.indexOf(': ');
    if(state)
        document.title=(colonPos>=0?document.title.substring(0,colonPos):document.title)+": "+state;
    else
    if(colonPos>=0)
        document.title=document.title.substring(0,colonPos);
}
