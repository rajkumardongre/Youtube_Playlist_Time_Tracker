// This function is the entry point of the extension. It fetches the playlist
// title, checks if the playlist length div exists, retrieves the playlist 
// videos, calculates the total length of the playlist in seconds, converts 
// the length to the desired format, and updates the playlist length div with
// the formatted time.
function fetchLength() {
    const playlistTitle = getPlaylistTitle();
    if (!playlistTitle) return;

    let playlistLengthDiv = document.getElementById("playlistLengthDiv");
    if (!playlistLengthDiv) {
        preparePlaylistLengthDiv(playlistTitle);
        playlistLengthDiv = document.getElementById("playlistLengthDiv");
    }

    const timeVids = getPlaylistVideos();

    const sec = calculatePlaylistLengthInSeconds(timeVids);
    const fullTime = getDayHourMinSec(sec);

    const timeString = prepareTimeString(fullTime);
    playlistLengthDiv.innerText = timeString;
}

// This function retrieves the playlist title element from the DOM using
// a CSS selector.
function getPlaylistTitle() {
    return document.getElementsByClassName("metadata-wrapper style-scope ytd-playlist-header-renderer")[0].getElementsByTagName("yt-formatted-string")[0]

}

// function creates a new div element, sets its attributes and styles, 
// inserts it after the playlist title element, and returns the created
// div element.

function preparePlaylistLengthDiv(playlistTitle) {
    const divNode = document.createElement("div");
    divNode.id = "playlistLengthDiv";
    playlistTitle.insertAdjacentElement("afterend", divNode);

    playlistLengthDiv.style.padding = "1rem";
    playlistLengthDiv.style.backgroundColor = "black";
    playlistLengthDiv.style.color = "white";
    playlistLengthDiv.style.fontSize = "2rem";
    playlistLengthDiv.style.borderRadius = "1rem";
    playlistLengthDiv.style.fontWeight = "bold";
    playlistLengthDiv.style.marginRight = "1rem";
}

// This function retrieves an array of playlist video elements from the 
// DOM and returns a subset of the array, excluding the first four and  
// last elements. This assumes that the first four and last elements 
// are not part of the actual videos in the playlist.

function getPlaylistVideos() {
    const videos = document.getElementsByClassName("ytd-playlist-video-list-renderer");
    var arr = [].slice.call(videos);
    return arr.slice(4,-1)
}

// This function iterates over the playlist video elements, extracts the 
// time text of each video, splits it by ":" to get individual time components, 
// converts the components to seconds, and sums them up to calculate the total 
// length of the playlist in seconds.

function calculatePlaylistLengthInSeconds(timeVids) {
    let sec = 0;
    for (let i = 0; i < timeVids.length; i++) {
        const timeText = timeVids[i].getElementsByClassName("style-scope ytd-thumbnail-overlay-time-status-renderer")[1].innerText;
        const t = timeText.split(":");
        sec += getCurrentVideoLengthInSeconds(t);
    }
    return sec;
}

// This function takes an array of time components (hours, minutes, seconds) 
// and calculates the total length in seconds by converting each component 
// to seconds and adding them together.

function getCurrentVideoLengthInSeconds(t) {
    if(t.length == 4){
        return parseInt(t[0]*60*60*24) + parseInt(t[1]*60*60) + parseInt(t[2]*60) + parseInt(t[3])
    }else if(t.length == 3){
        return parseInt(t[0]*60*60) + parseInt(t[1]*60) + parseInt(t[2])
    }else if(t.length == 2){
        return parseInt(t[0]*60) + parseInt(t[1])
    }else{
        return parseInt(t[0])
    }
}

// function takes the total length of the playlist in seconds and calculates 
// the corresponding number of days, hours, minutes, and remaining seconds.

function getDayHourMinSec(sec) {
    const day = parseInt(sec / (60 * 60 * 24));
    sec = sec % (60 * 60 * 24);
    const hour = parseInt(sec / (60 * 60));
    sec = sec % (60 * 60);
    const minute = parseInt(sec / 60);
    sec = sec % 60;
    return [day, hour, minute, sec];
}

// function takes the calculated time components (days, hours, minutes, 
// seconds) and formats them into a human-readable string representation.

function prepareTimeString(fullTime) {
    const [day, hour, minute, sec] = fullTime;
    let timeString = "";

    if (day !== 0) {
        timeString += ` ${day} day`;
    }
    if (hour !== 0) {
        timeString += ` ${hour} Hr`;
    }
    if (minute !== 0) {
        timeString += ` ${minute} min`;
    }
    if (sec !== 0) {
        timeString += ` ${sec} sec`;
    }

    return timeString;
}

// function is used to call the fetchLength function every second, updating 
// the displayed playlist length in real-time.

setInterval(fetchLength, 1000);
console.log("script 2 loaded")
