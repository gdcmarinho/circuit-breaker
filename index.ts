import { CircuitBreaker } from './src/CircuitBreaker';
import { TimePreferences } from './src/interface/ITimePreferences';

const EXAMPLE_ACT = function mockExternalServiceReturn(message: string = 'Trying to connect...'): number {
    console.log(message);
    return 500; // INFO: Change to status code 500 or more to see retries
};

const EXAMPLE_TIME_PREFERENCES: TimePreferences = {
    timeout: 3000,
    timeRetry: 5000,
    progressiveRetry: true,
};

const circuitBreaker = new CircuitBreaker(
    EXAMPLE_ACT,
    EXAMPLE_TIME_PREFERENCES
);
