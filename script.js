/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */
//Global constants
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
const patternSize = 8;

//Global Variables
var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;
function randomPatternGenerator(){
  pattern = [];
  var pickNum = Math.floor((Math.random() * 5) + 1);
  for(let i=0;i<=patternSize;i++){
    pattern.push(pickNum);
    pickNum = Math.floor((Math.random() * 5) + 1);
  }
}

function startGame(){
  //initialize the game variables
  guessCounter = 0;
  progress = 0;
  gamePlaying = true;
  randomPatternGenerator();
  
  //swap the start and stop buttons
  document.getElementById('startBtn').classList.add('hidden');
  document.getElementById('stopBtn').classList.remove('hidden');
  playClueSequence();
}

function stopGame(){
  gamePlaying  = false;
  //swap the start and stop buttons
  document.getElementById('stopBtn').classList.add('hidden');
  document.getElementById('startBtn').classList.remove('hidden');  
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  clueHoldTime = 1000;
  cluePauseTime = 333;
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over! You Lost. But Don't Worry! Try Again!");
}

function winGame(){
  stopGame();
  alert("Game Over! Victory!");
}

function guess(btn){
  console.log("user-guessed: "+btn);
  if(!gamePlaying){
    return;
  }
  if(pattern[guessCounter]==btn){
    if(guessCounter == progress){
      if(progress == pattern.length-1){
        winGame();
      }
      else{
        progress++;
        playClueSequence();
      }
    }
    else{
      guessCounter++;
    }
  }
  else{
    loseGame();
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 350.0,
  2: 390.6,
  3: 208.14,
  4: 589.87,
  5: 450.22
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)