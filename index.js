defaultTimePreferences = {
    timeout: 3000, 
    timeRetry: 30000
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
        !timePreferences ? this.timePreferences = defaultTimePreferences : this.timePreferences = timePreferences;

        if (!act)
            throw new Error('No act was informed. Please enter a method to be executed.');

        if (typeof action == 'function')
            Promise.resolve(action);
    }

    getCurrentState() {
        console.log('>> Verifying current state');
        return currentState;
    }

    updateState(newState) {
        STATES.forEach(state => {
            if (newState == state)
                currentState = newState;
        });
    }}
