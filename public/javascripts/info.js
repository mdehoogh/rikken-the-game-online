var infoElement=document.getElementById('info');
function setInfo(info){
    if(!info)return;
    console.log("Rikken - het spel >>> info: "+info);
    if(infoElement)infoElement.innerHTML=info;
}
function clearInfo(){if(infoElement)infoElement.innerHTML="";}
