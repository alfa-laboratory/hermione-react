const { createTestEnvironment, openTestEnvironment, closeTestEnvironment } = require('./lib/environment');

// TODO: разобраться, почему плагин стартует дважды
module.exports = (hermione, options) => {
    const testEnvironment = createTestEnvironment(hermione, options);
    const openEnvironment = (environment) => () => openTestEnvironment(environment, options);
    const closeEnvironment = (environment) => () => closeTestEnvironment(environment);

    hermione.on(hermione.events.RUNNER_START, openEnvironment(testEnvironment));
    hermione.on(hermione.events.RUNNER_END, closeEnvironment(testEnvironment));
};
