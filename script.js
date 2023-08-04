const audioElement = document.getElementById("audio");
const playlistElement = document.getElementById("playlist");
let currentIndex = 0; // To keep track of the current track index
let tracksData = []; // Store the data array

// Fetch JSON data
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
    }
  })
  .catch(error => console.error("Error fetching JSON data:", error));

// Function to load track information into the player and play
function loadAndPlayTrack(audioUrl, index) {
  loadTrack(index);
  playAudio(audioUrl);
}

// Function to load track information into the player
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

// Function to play audio
function playAudio(audioUrl) {
  audioElement.src = audioUrl;
  audioElement.play();

  // Listen for the "ended" event to autoplay the next track
  audioElement.addEventListener("ended", playNextTrack);
}

// Function to play the next track
function playNextTrack() {
  currentIndex++;
  const tracks = playlistElement.querySelectorAll(".wrapper");
  
  if (currentIndex < tracks.length) {
    const nextTrack = tracksData[currentIndex];
    loadAndPlayTrack(nextTrack.audioUrl, currentIndex);
  }
}
