const DEFAULT_TIME_PREFERENCES = {
    timeout: 3000,
    timeRetry: 30000,
    progressiveRetry: false
}

const STATES = [
    'closed',
    'open',
    'halfOpen'
];

var currentState;
var timePreferences;

class CircuitBreaker {
    constructor(act, timePreferences) {
        this.currentState = STATES[0];
        !timePreferences ? this.timePreferences = DEFAULT_TIME_PREFERENCES : this.timePreferences = timePreferences;

        if (!act)
            throw new Error('No act was informed. Please enter a method to be executed.');

        if (typeof act !== 'function')
            throw new Error('The act informed was not a function. Please enter a function to be executed.');

        this.executeAct(act, this.timePreferences);
    }

    getCurrentState() {
        return currentState;
    }

    updateState(newState) {
        STATES.forEach(state => {
            if (newState == state)
                currentState = newState;
        });
    }

    executeAct(act, timePreferences, isHalfOpen) {
        Promise.resolve(act).then((res) => {
            if (res >= 500) {
                this.updateState(STATES[1]);

                setTimeout(() => {
                    if (isHalfOpen)
                        this.updateState(STATES[2]);
                    
                    this.executeAct(act, timePreferences, true)
                }, timePreferences.timeRetry);
            } else {
                this.updateState(STATES[0]);

                return res;
            }
        });
    }
}
