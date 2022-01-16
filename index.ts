import { CircuitBreaker } from './src/CircuitBreaker';
import { TimePreferences } from './src/model/TimePreferences';

const EXAMPLE_ACT = function mockExternalServiceReturn(): number {
    return 200;
};

const EXAMPLE_TIME_PREFERENCES: TimePreferences = {
    timeout: 3000,
    timeRetry: 5000,
    progressiveRetry: false,
};

new CircuitBreaker(
    EXAMPLE_ACT,
    EXAMPLE_TIME_PREFERENCES
);
