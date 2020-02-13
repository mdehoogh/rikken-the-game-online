var infoElement=document.getElementById('info');
var infosourceElement=document.getElementById('info-source');
function setInfo(info,infosource){
    if(!info)return;
    console.log(document.title+" >>> INFO: "+info);
    if(infoElement)infoElement.innerHTML=info;
    if(infosourceElement)infosourceElement.innerHTML=(infosource?infosource.toString()+":&nbsp;":"?");
}

function clearInfo(){
    if(infoElement)infoElement.innerHTML="";
    if(infosourceElement)infosourceElement.innerHTML="";
}

function showGameState(state){
    let colonPos=document.title.indexOf(': ');
    if(state)
        document.title=(colonPos>=0?document.title.substring(0,colonPos):document.title)+": "+state;
    else
    if(colonPos>=0)
        document.title=document.title.substring(0,colonPos);
}

function toggleGameState(state){
    let colonPos=document.title.lastIndexOf(': ');
    if(colonPos>=0){
        let statelessTitle=document.title.substring(0,colonPos);
        document.title=statelessTitle+(!state||document.title.substring(colonPos+2)===state?"":state);
    }else
    if(state)
        document.title=document.title+": "+state;
}
