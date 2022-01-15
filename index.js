timePreferences = {
    timeout: 3000, 
    timeRetry: 30000
}

const STATES = [
    "closed",
    "open",
    "halfOpen"
];

var currentState;
var timePreferences;

class CircuitBreaker {
    constructor(timePreferences) {
        console.log("INITIALIZING CIRCUIT BREAKER");
        this.currentState = STATES[0];

        if (timePreferences)
            this.timePreferences = timePreferences;
    }

    getCurrentState() {
        console.log(">> Verifying current state");
        return currentState;
    }

    updateState(newState) {
        STATES.forEach(state => {
            if (newState == state)
                currentState = newState;
        });
    }
}

const circuitBreaker = new CircuitBreaker();
console.log("The current state is " + circuitBreaker.getCurrentState());

circuitBreaker.updateState("open")
console.log("The current state is " + circuitBreaker.getCurrentState());
