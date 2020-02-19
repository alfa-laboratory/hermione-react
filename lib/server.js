const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const http = require('http');
const enableDestroy = require('server-destroy');
const _ = require('lodash');
const path = require('path');

const readWebpackConfig = (webpackConfigPath, projectRoot) => {
    const webpackConfigRelativePath = path.resolve(projectRoot, webpackConfigPath);

    // eslint-disable-next-line import/no-dynamic-require, global-require
    const webpackConfig = require(webpackConfigRelativePath);

    return webpackConfig;
};

const addOptionsToWebpackConfig = (config, options) => _.assign({}, config, options);


// TODO: разобраться, почему не работают noInfo и quiet
// TODO: добавить в webpackConfig в publicPath и, при необходимости, др.параметры по-умолчанию
const createCompileMiddleware = (webpackConfig) => {
    const compiler = webpack(webpackConfig);
    return webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true,
        quiet: true,
    });
};

// TODO: Необходимо реализовать разные роуты для разных тестов. Это необходимо,
// чтобы обеспечить параллельное тестирование.
const createRouteMiddleware = (routes) => (req, res, next) => {
    const routeName = path.basename(req.path);
    if (routes.includes(routeName)) {
        const templateData = `
            <html>
                <head>
                </head>
                <body>
                  <div data-hermione-react id="root-box">
                    Hermione
                  </div>
                  <script type="text/javascript" src="${routeName}.js"></script>
                <body>
            </html>`;
        res.set('content-type', 'text/html');
        res.send(templateData);
    }

    next();
};

const createHttpServer = (webpackConfigPath, projectRoot, routes) => {
    const webpackEntryPoints = {};
    const extraConfigOptions = { entry: () => webpackEntryPoints };

    const webpackConfig = readWebpackConfig(webpackConfigPath, projectRoot);
    const preparedWebpackConfig = addOptionsToWebpackConfig(webpackConfig, extraConfigOptions);

    const compileMiddleware = createCompileMiddleware(preparedWebpackConfig);
    const routeMiddleware = createRouteMiddleware(routes);

    const requestListener = express();
    requestListener.use(compileMiddleware);
    requestListener.use(routeMiddleware);

    const server = http.createServer(requestListener);
    enableDestroy(server);

    return { server, compileMiddleware, webpackEntryPoints };
};

module.exports = createHttpServer;
