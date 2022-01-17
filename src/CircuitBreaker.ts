/*
 Copyright (c) 2022 Gabriel Marinho

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { CLOSED, HALF_OPEN, OPEN } from './model/States';
import { TimePreferences } from './interface/ITimePreferences'

const DEFAULT_TIME_PREFERENCES: TimePreferences = {
    timeout: 3000,
    timeRetry: 30000,
    progressiveRetry: false,
};

/**
 * A CircuitBreaker instance provide multiple methods and properties to improve retry connections with external services
 */
export class CircuitBreaker {
    currentState: typeof CLOSED | typeof OPEN | typeof HALF_OPEN;
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

    /**
     * Get the current circuit breaker state of instance
     *
     * @returns the current circuit breaker state
     */
    getCurrentState(): typeof CLOSED | typeof OPEN | typeof HALF_OPEN {
        return this.currentState;
    }

    /**
     * Update the circuit breaker state of instance
     *
     * @param newState State to be updated
     */
    updateState(newState: typeof CLOSED | typeof OPEN | typeof HALF_OPEN): void {
        this.currentState = newState;
    }

    /**
     * Execute the act trying to communicate with external service/tool
     *
     * @param act Function that will be executed to call external service
     * @param timePreferences Time preferences for connection retries
     * @param isHalfOpen True if is a new retry and false if is not
     */
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

                    console.log('Waited', timePreferences.timeRetry + 'ms');
                }

                this.executeAct(act, timePreferences, true);
            }, timePreferences.timeRetry);
        } else {
            this.updateState(CLOSED);
        }
    }
}
