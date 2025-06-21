// Transcription code 
// https://medium.spatialpixel.com/sounds-bd05429aba38

let speechRecognition;
let isListening = false;
let textToShow = "";

function setup() {
  createCanvas(400, 400);
  background(255);

  // Initialize speech recognition
  speechRecognition = new webkitSpeechRecognition() || new SpeechRecognition();
  speechRecognition.continuous = true;   
  speechRecognition.interimResults = true;
  speechRecognition.lang = 'es-MX';

  // Handle the result event
  speechRecognition.onresult = function(event) {
    if (event.results.length > 0) {
      // results.length indicates the latest script built
      textToShow = event.results[event.results.length-1][0].transcript.split(" ").at(-1);
    }
  };
}

function draw() {
  background(255);
  fill(0);
  textSize(32);
  text(textToShow, 10, height / 2);
}

function keyPressed() {
  if (keyCode === 32) { // Spacebar
    if (!isListening) {
      speechRecognition.start();
      isListening = true;
    }
  }
}

function keyReleased() {
  if (keyCode === 32) { // Spacebar
    if (isListening) {
      speechRecognition.stop();
      isListening = false;
    }
  }
}