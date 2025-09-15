
// script.js: Vanilla JS for audio player and visualizer

// Get references to DOM elements
const audio = document.getElementById('audio'); // hidden audio element
const playPauseBtn = document.getElementById('playPause');
const volumeSlider = document.getElementById('volume');
const trackList = document.getElementById('trackList');
const trackItems = trackList.getElementsByTagName('li');
const toggleListBtn = document.getElementById('toggleList');
const fileInput = document.getElementById('fileInput');

// Create AudioContext and connect the 


const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);

// Configure the analyser for frequency data
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount; // half of fftSize (128)
const dataArray = new Uint8Array(bufferLength);


// Set up the canvas for the visualizer
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

// Resize canvas to fit the container width
function resizeCanvas() {
  canvas.width = document.querySelector('.player-container').clientWidth;
  canvas.height = 150;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Draw the audio frequency bars (visualizer)
function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);

  analyser.getByteFrequencyData(dataArray);
  // Clear canvas
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;
  // Loop through frequency data to draw bars
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 2; // scale down height
    // Change color based on bar height (RGB)
    ctx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,200)';
    // Draw the bar (x, y, width, height)

    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}
drawVisualizer();

// Play/Pause button click handler
playPauseBtn.addEventListener('click', () => {
  // Resume AudioContext on user gesture if needed
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = 'Pause';
  } else {
    audio.pause();
    playPauseBtn.textContent = 'Play';

  }
});

// Volume control handler
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});

// Toggle track list display
toggleListBtn.addEventListener('click', () => {
  trackList.classList.toggle('open');
  toggleListBtn.textContent = trackList.classList.contains('open') ? 'Hide Tracks' : 'Tracks';
});

// Click on a track in the list
trackList.addEventListener('click', (e) => {
  if (e.target && e.target.nodeName === 

'LI') {
    // Resume AudioContext if suspended
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    // Set audio source to selected track
    audio.src = e.target.getAttribute('data-src');
    audio.play();
    playPauseBtn.textContent = 'Pause';
    // Highlight the active track
    for (let item of trackItems) {
      item.classList.remove('active');
    }
    e.target.classList.add('active');
  }
});

// Upload MP3 file handler
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];

  if (file) {
    // Resume AudioContext if suspended
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const fileURL = URL.createObjectURL(file);
    audio.src = fileURL;
    audio.play();
    playPauseBtn.textContent = 'Pause';
    // Remove active class from any track list items
    for (let item of trackItems) {
      item.classList.remove('active');
    }
  }
});

// Reset play button text when audio ends
audio.addEventListener('ended', () => {
  playPauseBtn.textContent = 'Play';

});
