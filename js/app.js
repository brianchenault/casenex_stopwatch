window.stopwatchApp = {
    init: function() {
        this.elements = {
            resetEl: document.getElementById('reset'),
            startEl: document.getElementById('start'),
            stopEl: document.getElementById('stop'),
            lapEl: document.getElementById('lap'),
            millisecondsEl: document.getElementById('ms'),
            secondsEl: document.getElementById('seconds'),
            minutesEl: document.getElementById('minutes'),
            hoursEl: document.getElementById('hours'),
            lapListEl: document.getElementById('lapList')
        };

        this.isRunning = false;
        this.isPaused = false;
        this.timerInterval = null;
        this.startTime = null;
        this.pauseTime = null;
        this.lapCounter = 0;
        this.timer = {
            hours: 0,
            minutes: 0,
            seconds: 0,
            ms: 0
        };

        this.elements.lapEl.addEventListener('click', this.onLapClick.bind(this));
        this.elements.startEl.addEventListener('click', this.onStartClick.bind(this));
        this.elements.stopEl.addEventListener('click', this.onStopClick.bind(this));
        this.elements.resetEl.addEventListener('click', this.onResetClick.bind(this));
    },

    // ideally we would have a collection that is bound to DOM (or Stores/FLUX/React/props!)
    // and push to that collection instead of this fairly "dumb" route
    onLapClick: function() {
        if (this.isRunning) {
            this.lapCounter++;
            var newLap = document.createElement('div');

            newLap.className = 'lap';
            // ugh, TEMPLATES - psyched for ES6 template strings
            newLap.innerHTML = '<span>' + this.lapCounter + '</span>' + this.ensureLeadingZeros(this.timer.hours, 2) + ':' +
            this.ensureLeadingZeros(this.timer.minutes, 2) + ':' +
            this.ensureLeadingZeros(this.timer.seconds, 2) + ':' +
            this.ensureLeadingZeros(this.timer.ms, 3);

            this.elements.lapListEl.insertBefore(newLap,  this.elements.lapListEl.childNodes[0]);
        }
    },

    interval: function() {
        // SHOULD HAVE THOUGHT OF THIS EARLIER WHEN MENTIONED IN INTERVIEW...DOH.
        // Admittedly, Googled. Womp womp.
        var elapsedTime = Date.now() - this.startTime;
        this.timer.ms = parseInt(elapsedTime % 1000);
        this.timer.seconds = parseInt((elapsedTime / 1000) % 60);
        this.timer.minutes = parseInt((elapsedTime / (1000 * 60)) % 60);
        this.timer.hours = parseInt((elapsedTime / (1000 * 60 * 60)) % 24);

        this.elements.secondsEl.innerHTML = this.ensureLeadingZeros(this.timer.seconds, 2);
        this.elements.minutesEl.innerHTML = this.ensureLeadingZeros(this.timer.minutes, 2);
        this.elements.hoursEl.innerHTML = this.ensureLeadingZeros(this.timer.hours, 2);
        this.elements.millisecondsEl.innerHTML = this.ensureLeadingZeros(this.timer.ms, 3);
    },

    onStartClick: function() {
        // if no interval loop running
        if (!this.timerInterval) {
            this.isRunning = true;

            if (!this.isPaused) {
                this.startTime = Date.now();
            } else {
                // need to factor in the time that it was paused
                this.startTime = Date.now() - this.pauseTime;
                this.isPaused = false;
            }

            this.timerInterval = setInterval(this.interval.bind(this), 10);
        }
    },

    onResetClick: function() {
        clearInterval(this.timerInterval);

        this.timerInterval = null;
        this.startTime = null;
        this.isRunning = false;
        this.lapCounter = 0;

        this.elements.hoursEl.innerHTML = '00';
        this.elements.minutesEl.innerHTML = '00';
        this.elements.secondsEl.innerHTML = '00';
        this.elements.millisecondsEl.innerHTML = '000';
        this.elements.lapListEl.innerHTML = '';
    },

    onStopClick: function() {
        // if already stopped, do nothing
        if (this.isRunning) {
            clearInterval(this.timerInterval);

            this.timerInterval = null;
            this.isRunning = false;
            this.isPaused = true;
            this.pauseTime = Date.now() - this.startTime;
        }
    },

    ensureLeadingZeros: function(num, numSize) {
        num = num.toString();

        while (num.length < numSize) {
            num = '0' + num;
        }

        return num;
    }
};

window.stopwatchApp.init();