const audioElement = document.getElementById("audio");
const playlistElement = document.getElementById("playlist");
const loopAllButton = document.getElementById("loopAllButton");
const loopButtons = document.querySelectorAll(".loop-track-btn"); 
let currentIndex = 0; // 
let tracksData = []; //
let isLooping = false; 
let isLoopingAll = false;
let activeLoopButton = null; 
const trackLoopStates = new Array(tracksData.length).fill(false);
const shouldStartPlaying = false;

loopAllButton.addEventListener("click", toggleLoopAll);

// Fetch JSON data and build the player
fetch("audio_data.json")
  .then(response => response.json())
  .then(data => {
    tracksData = data; // Store the data array
    data.forEach((item, index) => {
      // track wrapper
      const listItem = document.createElement("div");
      listItem.classList.add("wrapper");

      // track title
      const titleElement = document.createElement("p");
      titleElement.textContent = item.title;
      titleElement.classList.add("trackName");
      listItem.appendChild(titleElement);
      
      // track loop button
      const loopButton = document.createElement("button");
      loopButton.innerHTML = "&infin;";
      const infinityText = loopButton.textContent;
      loopButton.textContent = infinityText;
      loopButton.classList.add("loop-track-btn")

      isLooping
      ? loopButton.classList.add("loop-track-btn-active")
      : loopButton.classList.remove("loop-track-btn-active");

      loopButton.setAttribute("data-track-index", index);
      // loopButton.addEventListener("click", toggleLoop);
      listItem.appendChild(loopButton);

      // track duration mins/secs
      const durationElement = document.createElement("p");
      durationElement.textContent = item.trackDuration;
      durationElement.classList.add("trackDuration");
      listItem.appendChild(durationElement);

      // clicking track wrapper plays the track
      listItem.addEventListener("click", () => loadAndPlayTrack(item.audioUrl, index));
      playlistElement.appendChild(listItem);
    });
    // Load the first track automatically but pause audio
    if (data.length > 0) {
      loadAndPlayTrack(data[0].audioUrl, 0);
      audioElement.pause();
    }
  })
  .catch(error => console.error("Error fetching JSON data:", error));


function loadAndPlayTrack(audioUrl, index) {
  loadTrack(index);
  playAudio(audioUrl);
}

function loadTrack(index) {
  currentIndex = index;
  const tracks = playlistElement.querySelectorAll(".wrapper");
  tracks.forEach((track, i) => {
    if (i === index) {
      track.classList.add("active");
    } else {
      track.classList.remove("active");
    }
  });
}




function playAudio(audioUrl) {

  audioElement.src = audioUrl;  

  // Set loop attribute based on loop state of the current track
  audioElement.loop = trackLoopStates[currentIndex];

  audioElement.play();
  
  // Listen for the "ended" event to autoplay the next track
  audioElement.addEventListener("ended", playNextTrack);
}



// Function to play the next track
function playNextTrack() {
  currentIndex++;
  const tracks = playlistElement.querySelectorAll(".wrapper");

  if (currentIndex >= tracks.length) {
    // Loop single track if button active
    if (isLooping) {
      currentIndex = 0;
    } 
    // Loop All ON
    else if(isLoopingAll) {
      loadAndPlayTrack(tracksData[0].audioUrl, 0);
    }
    // Loop All oFF
    else {
      audioElement.pause();
      return;
    }
  }
  
  // Move to next track unless current track is last track and NOT loop All ON
  const nextTrack = tracksData[currentIndex];
  loadAndPlayTrack(nextTrack.audioUrl, currentIndex);
}


function toggleLoopAll() {
  isLoopingAll = !isLoopingAll;
  loopAllButton.classList.toggle("loop-all-btn-active", isLoopingAll);
}
















/* 

function toggleLoop(event) {
  event.stopPropagation();
  const loopButton = event.currentTarget;
  const trackIndex = parseInt(loopButton.getAttribute("data-track-index"));

  loopButton.classList.toggle("loop-track-btn-active");

  trackLoopStates[trackIndex] = !trackLoopStates[trackIndex];

  isLooping = trackLoopStates[currentIndex];
  audioElement.loop = isLooping;
}

loopButtons.forEach(loopButton => {
  loopButton.addEventListener("click", toggleLoop);
});

 */