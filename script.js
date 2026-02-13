let timer;
let startTime;
let elapsedTime = 0;
let running = false;

function handle(e){
        if(e.keyCode === 13){
            e.preventDefault();
            handleCapture();
        }
    }

function formatTime(time) {
  let hours = Math.floor(time / 3600000);
  let minutes = Math.floor((time % 3600000) / 60000);
  let seconds = Math.floor((time % 60000) / 1000);
  let milliseconds = time % 1000;

  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');
  milliseconds = String(milliseconds).padStart(3, '0');

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function updateDisplay() {
  document.getElementById('display').textContent = formatTime(elapsedTime);
}

function startStop() {
  if (!running) {
    startTime = Date.now() - elapsedTime;
    timer = setInterval(function() {
      elapsedTime = Date.now() - startTime;
      updateDisplay();
    }, 10);
    document.getElementById('startStopBtn').textContent = 'Stop';
  } else {
    clearInterval(timer);
    document.getElementById('startStopBtn').textContent = 'Start';
  }
  running = !running;
}

function reset() {
  clearInterval(timer);
  running = false;
  elapsedTime = 0;
  updateDisplay();
  document.getElementById('startStopBtn').textContent = 'Start';
}

function handleCapture() {
    const bibNumber = document.getElementById('bibNumberInput').value.trim();
    if (bibNumber === '') {
      alert('Please enter a bib number.');
      return;
    }
    
    const time = formatTime(elapsedTime);
    const finishersList = document.getElementById('finishersList');
    const listItem = document.createElement('li');
    listItem.textContent = `Bib Number: ${bibNumber} - ${time}`;
    finishersList.appendChild(listItem);
  
    // Clear bib number input field
    document.getElementById('bibNumberInput').value = '';
  }
  

// Function to handle finishing the race and exporting the list of bib numbers with stopwatch times
function finishRace() {
    const raceName = document.getElementById('raceInput').value.trim();
    if (raceName.length == 0)
        raceName = 'Race_Name';
    const filename = raceName + '.csv';

    const finishers = Array.from(document.querySelectorAll('#finishersList li'))
                           .map(item => item.textContent.split('-').map(entry => entry.trim()));
  
    if (finishers.length === 0) {
      alert('No finishers to export.');
      return;
    }
  
    let textToSave = '';
    finishers.forEach(finisher => {
      const bibNumber = finisher[0].split(':')[1].trim();
      const time = finisher[1].trim();
      textToSave += `${bibNumber};${time}\n`;
    });
  
    // Create a blob for the text content
    const blob = new Blob([textToSave], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    // Create a temporary <a> element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
  
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }


document.getElementById('finishRaceBtn').addEventListener('click', finishRace);
document.getElementById('startStopBtn').addEventListener('click', startStop);
document.getElementById('resetBtn').addEventListener('click', reset);
