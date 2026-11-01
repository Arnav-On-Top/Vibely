let audio=document.getElementById("audio");
let songName=document.getElementById("songName");
let artistName=document.getElementById("artistName");
let playBtn=document.getElementById("playBtn");
let progress=document.getElementById("progress");
let currentTime=document.getElementById("currentTime");
let duration=document.getElementById("duration");
let volume=document.getElementById("volume");
let musicFile=document.getElementById("musicFile");
let playlist=document.getElementById("playlist");
let searchSong=document.getElementById("searchSong");
let repeatBtn=document.getElementById("repeatBtn");
let songs=[];
let songIndex=0;
let repeat=1;
let repeatCount=0;
musicFile.addEventListener("change", function(){
    let files=musicFile.files;
    for(let i=0; i<files.length; i++){
        let song={
            name:files[i].name.replace(/\.mp3$/i,""),
            file: URL.createObjectURL(files[i])
        };
        songs.push(song);
    }
    showPlaylist();
    songIndex=0;
    loadSong();
});
function showPlaylist(){
    playlist.innerHTML="";
    for(let i=0; i<songs.length; i++){
        let li=document.createElement("li");
        li.innerText=songs[i].name;
        li.onclick=function(){
            songIndex=i;
            loadSong();
            audio.play();
        };
        li.classList.toggle("active", i===songIndex);
        playlist.appendChild(li);
    }
}
function loadSong(){
    audio.src=songs[songIndex].file;
    songName.innerText=songs[songIndex].name;
    artistName.innerText="Your Music";
    progress.value=0;
    currentTime.innerText="0:00";
    duration.innerText="0:00";
    repeatCount=0;
    showPlaylist();
}
function playPause(){
    let playPromise=audio.paused?audio.play():audio.pause();
}
function nextSong(){
    songIndex++;
    songIndex=songIndex%songs.length;
    loadSong();
    audio.play();
}
function previousSong(){
    songIndex--;
    songIndex=(songIndex+songs.length)%songs.length;
    loadSong();
    audio.play();
}
function repeatSong(){
    repeat=repeat%4+1;
    repeatBtn.innerText=[
        "Repeat: 1",
        "Repeat: 2",
        "Repeat: 3",
        "Repeat: Infinity"
    ][repeat-1];
    repeatBtn.classList.toggle("active",true);
    repeatCount=0;
}
searchSong.addEventListener("input",function(){
    let searchValue=searchSong.value.toLowerCase();
    playlist.innerHTML="";
    for(let i=0; i<songs.length; i++){
        let song=songs[i].name.toLowerCase();
        let li=document.createElement("li");
        li.innerText=songs[i].name;
        li.onclick=function(){
            songIndex=i;
            loadSong();
            audio.play();
        };
        let match=song.includes(searchValue);
        li.style.display=["none","block"][Number(match)];
        li.classList.toggle("active", i===songIndex);
        playlist.appendChild(li);
    }
});
audio.addEventListener("timeupdate", function(){
    let value=(audio.currentTime/audio.duration)*100;
        progress.value=value;
        currentTime.innerText=formatTime(audio.currentTime);

});
audio.addEventListener("loadedmetadata",function(){
    duration.innerText=formatTime(audio.duration);
});
function formatTime(time){
    let minutes=Math.floor(time/60);
    let seconds=Math.floor(time%60);
    seconds=String(seconds).padStart(2, "0");
    return minutes+":"+seconds;
}
progress.addEventListener("input", function(){
    audio.currentTime=(progress.value/100)*audio.duration;
});
volume.addEventListener("input", function(){
    audio.volume=volume.value;
});
audio.addEventListener("ended", function(){
    repeatCount++;
    let repeatAgain=repeat===4 || repeatCount<repeat;
    let nextIndex=(songIndex+1)%songs.length;
    songIndex=[
        nextIndex,
        songIndex
    ][Number(repeatAgain)];
    loadSong();
    audio.play();
});
audio.addEventListener("play", function(){
    playBtn.innerText="Pause";
});
audio.addEventListener("pause", function(){
    playBtn.innerText="Play";
});