const path = require('path');
const mkdirp = require('mkdirp');
const prepareTest = require('./prepareTest');
const createHttpServer = require('./server');

const extractFileNameFromPath = (file) => path.basename(file).split('.').slice(0, -1).join('.');

const prepareTestsDir = (projectRoot, { preparedTestsDir } = 'prepared-tests') => {
    const relativePreparedTestsDir = path.join(path.resolve(projectRoot), preparedTestsDir);
    mkdirp(relativePreparedTestsDir);
    return relativePreparedTestsDir;
};

const openTestEnvironment = ({ server }, { port }) => server.listen(port);

const closeTestEnvironment = ({ compileMiddleware, server }) => {
    compileMiddleware.close();
    server.destroy();
};

const createTestEnvironment = (hermione, options) => {
    const { projectRoot } = hermione.config.system.ctx;
    const routes = [];
    const {
        server,
        compileMiddleware,
        webpackEntryPoints,
    } = createHttpServer(options.webpackConfig, projectRoot, routes);

    const preparedTestsDir = prepareTestsDir(projectRoot, options);

    hermione.on(hermione.events.BEFORE_FILE_READ, ({ file }) => {
        const fileName = extractFileNameFromPath(file);
        routes.push(fileName);
        webpackEntryPoints[fileName] = prepareTest(file, preparedTestsDir);
        compileMiddleware.invalidate();
    });

    return {
        server,
        compileMiddleware,
    };
};

module.exports = {
    openTestEnvironment,
    closeTestEnvironment,
    createTestEnvironment,
};
