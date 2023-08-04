const audioElement = document.getElementById("audio");
const playlistElement = document.getElementById("playlist");

// Fetch JSON data
fetch("audio_data.json")
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
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

      listItem.addEventListener("click", () => playAudio(item.audioUrl));
      playlistElement.appendChild(listItem);
    });
  })
  .catch(error => console.error("Error fetching JSON data:", error));

// Function to play audio
function playAudio(audioUrl) {
  audioElement.src = audioUrl;
  audioElement.play();
}
