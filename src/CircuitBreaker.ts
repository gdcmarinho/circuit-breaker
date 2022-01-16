import { CLOSED, HALF_OPEN, OPEN } from './model/States';
import { TimePreferences } from './model/TimePreferences';

const DEFAULT_TIME_PREFERENCES: TimePreferences = {
    timeout: 3000,
    timeRetry: 30000,
    progressiveRetry: false,
};

export class CircuitBreaker {
    currentState: any;
    timePreferences: TimePreferences;

    constructor(act: Function, timePreferences?: TimePreferences) {
        this.currentState = CLOSED;
        !timePreferences
            ? (this.timePreferences = DEFAULT_TIME_PREFERENCES)
            : (this.timePreferences = timePreferences);

        if (!act)
            throw new Error(
                'No act was informed. Please enter a method to be executed.'
            );

        this.executeAct(act, this.timePreferences, false);
    }

    getCurrentState(): SymbolConstructor {
        return this.currentState;
    }

    updateState(newState: symbol): void {
        this.currentState = newState;
    }

    executeAct(
        act: Function,
        timePreferences: TimePreferences,
        isHalfOpen: boolean
    ): void {
        const res = act();

        if (res >= 500) {
            this.updateState(OPEN);
            console.log('Service Unavailable', res);

            setTimeout(() => {
                if (isHalfOpen) {
                    this.updateState(HALF_OPEN);
                    if (timePreferences.progressiveRetry) timePreferences.timeRetry = timePreferences.timeRetry * 2;
                }

                this.executeAct(act, timePreferences, true);
            }, timePreferences.timeRetry);
        } else {
            this.updateState(CLOSED);

            return res;
        }
    }
}
