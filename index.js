const DEFAULT_TIME_PREFERENCES = {
    timeout: 3000,
    timeRetry: 30000,
    progressiveRetry: false
}

const CLOSED = Symbol('closed');
const OPEN = Symbol('open');
const HALF_OPEN = Symbol('halfOpen');

var currentState;
var timePreferences;

class CircuitBreaker {
    constructor(act, timePreferences) {
        this.currentState = CLOSED;
        !timePreferences ? this.timePreferences = DEFAULT_TIME_PREFERENCES : this.timePreferences = timePreferences;

        if (!act)
            throw new Error('No act was informed. Please enter a method to be executed.');

        if (typeof act !== 'function')
            throw new Error('The act informed was not a function. Please enter a function to be executed.');

        this.executeAct(act, this.timePreferences);
    }

    getCurrentState() {
        return this.currentState;
    }

    updateState(newState) {
        currentState = newState;
    }

    executeAct(act, timePreferences, isHalfOpen) {
        const res = act();

        if (res >= 500) {
            this.updateState(OPEN);
            console.log("Service Unavailable", res);

            setTimeout(() => {
                if (isHalfOpen)
                    this.updateState(HALF_OPEN);

                this.executeAct(act, timePreferences, true)
            }, timePreferences.timeRetry);
        } else {
            this.updateState(CLOSED);

            return res;
        }
    };
}

const EXAMPLE_ACT = function printHelloWorld() {
    return 501;
}

const EXAMPLE_TIME_PREFERENCES = {
    timeout: 3000,
    timeRetry: 10000,
    progressiveRetry: false
}

const circuitBreaker = new CircuitBreaker(EXAMPLE_ACT, EXAMPLE_TIME_PREFERENCES);