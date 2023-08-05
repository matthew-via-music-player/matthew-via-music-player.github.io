const audioElement = document.getElementById("audio");
const playlistElement = document.getElementById("playlist");
const loopAllButton = document.getElementById("loopAllButton");
const loopButtons = document.querySelectorAll(".loop-track-btn"); 
let currentIndex = 0; // 
let tracksData = []; //
let isLooping = false; 
let activeLoopButton = null; 
const trackLoopStates = new Array(tracksData.length).fill(false);
const shouldStartPlaying = false;

// Fetch JSON data and build the player
fetch("audio_data.json")
  .then(response => response.json())
  .then(data => {
    tracksData = data; // Store the data array
    data.forEach((item, index) => {
      const listItem = document.createElement("div");
      listItem.classList.add("wrapper");

      const titleElement = document.createElement("p");
      titleElement.textContent = item.title;
      titleElement.classList.add("trackName");
      listItem.appendChild(titleElement);
      
      const loopButton = document.createElement("button");
      loopButton.innerHTML = "&infin;";
      const infinityText = loopButton.textContent;
      loopButton.textContent = infinityText;
      loopButton.classList.add("loop-track-btn")

      isLooping
      ? loopButton.classList.add("loop-track-btn-active")
      : loopButton.classList.remove("loop-track-btn-active");

      loopButton.setAttribute("data-track-index", index);
      loopButton.addEventListener("click", toggleLoop);
      listItem.appendChild(loopButton);

      const durationElement = document.createElement("p");
      durationElement.textContent = item.trackDuration;
      durationElement.classList.add("trackDuration");
      listItem.appendChild(durationElement);

      listItem.addEventListener("click", () => loadAndPlayTrack(item.audioUrl, index));
      playlistElement.appendChild(listItem);
    });
    // Load the first track automatically
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
    // If the last track has finished playing
    if (isLooping) {
      currentIndex = 0;
    } else {
      // Stop playback when all tracks have finished (without Loop All)
      audioElement.pause();
      return;
    }
  }
  
  const nextTrack = tracksData[currentIndex];
  loadAndPlayTrack(nextTrack.audioUrl, currentIndex);
}








































function toggleLoop(event) {
  event.stopPropagation(); // Prevent event propagation to parent elements
  const loopButton = event.currentTarget;
  const trackIndex = parseInt(loopButton.getAttribute("data-track-index"));

  loopButton.classList.toggle("loop-track-btn-active");

  // Toggle the loop state for the corresponding track
  trackLoopStates[trackIndex] = !trackLoopStates[trackIndex];

  // Set the loop attribute based on the loop state of the current track
  isLooping = trackLoopStates[currentIndex];
  audioElement.loop = isLooping;
}



// Add event listener to individual loop buttons
loopButtons.forEach(loopButton => {
  loopButton.addEventListener("click", toggleLoop);
});

