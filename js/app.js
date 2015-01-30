// admittedly all procedural and for that a bit yucky
(function() {
    // DOM
    var resetEl = document.getElementById('reset');
    var startEl = document.getElementById('start');
    var stopEl = document.getElementById('stop');
    var lapEl = document.getElementById('lap');
    var millisecondsEl = document.getElementById('ms');
    var secondsEl = document.getElementById('seconds');
    var minutesEl = document.getElementById('minutes');
    var hoursEl = document.getElementById('hours');
    var lapListEl = document.getElementById('lapList');

    // app stuff
    var timerInterval;
    var isRunning = false;
    var isPaused = false;
    var startTime = null;
    var pauseTime = null;
    var lapCounter = 0;
    var timer = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        ms: 0
    };

    // ideally we would have a collection that is bound to DOM (or Stores/FLUX/React/props!)
    //  and push to that collection instead of this fairly "dumb" route
    var onLapClick = function() {
        if (isRunning) {
            lapCounter++;
            var newLap = document.createElement('div');

            newLap.className = 'lap';
            // ugh, TEMPLATES
            newLap.innerHTML = '<span>' + lapCounter + '</span>' + ensureLeadingZeros(timer.hours, 2) + ':' +
            ensureLeadingZeros(timer.minutes, 2) + ':' +
            ensureLeadingZeros(timer.seconds, 2) + ':' +
            ensureLeadingZeros(timer.ms, 3);

            lapListEl.insertBefore(newLap,  lapListEl.childNodes[0]);
        }
    };

    var onStartClick = function() {
        if (!timerInterval) {
            isRunning = true;

            if (!isPaused) {
                startTime = Date.now();
            } else {
                startTime = Date.now() - pauseTime;
                isPaused = false;
            }

            timerInterval = setInterval(function() {
                // SHOULD HAVE THOUGHT OF THIS EARLIER WHEN MENTIONED IN INTERVIEW...DOH.
                // Admittedly, Googled. Womp womp.
                var elapsedTime = Date.now() - startTime;
                timer.ms = parseInt((elapsedTime % 1000)/10);
                timer.seconds = parseInt((elapsedTime / 1000) % 60);
                timer.minutes = parseInt((elapsedTime / (1000 * 60)) % 60);
                timer.hours = parseInt((elapsedTime / (1000 * 60 * 60)) % 24);

                secondsEl.innerHTML = ensureLeadingZeros(timer.seconds, 2);
                minutesEl.innerHTML = ensureLeadingZeros(timer.minutes, 2);
                hoursEl.innerHTML = ensureLeadingZeros(timer.hours, 2);
                millisecondsEl.innerHTML = ensureLeadingZeros(timer.ms, 3);
            }, 10);
        }
    };

    var onResetClick = function() {
        clearInterval(timerInterval);

        timerInterval = null;
        startTime = null;
        isRunning = false;
        lapCounter = 0;

        hoursEl.innerHTML = '00';
        minutesEl.innerHTML = '00';
        secondsEl.innerHTML = '00';
        millisecondsEl.innerHTML = '000';
        lapListEl.innerHTML = '';
    };

    var onStopClick = function() {
        if (isRunning) {
            clearInterval(timerInterval);

            timerInterval = null;
            isRunning = false;
            isPaused = true;
            pauseTime = Date.now() - startTime;
        }
    };

    function ensureLeadingZeros(num, numSize) {
        num = num.toString();

        while (num.length < numSize) {
            num = '0' + num;
        }

        return num;
    }

    lapEl.addEventListener('click', onLapClick);
    startEl.addEventListener('click', onStartClick);
    stopEl.addEventListener('click', onStopClick);
    resetEl.addEventListener('click', onResetClick);

})(); // IIFE to keep global scope clear