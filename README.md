# hermione-react
Hermione plugin for simplifying visual regression testing on React + webpack stack.

WARNING: Right now plugin is under construction, do not use it in production.

## Configuring
Install plugin using npm:
```npm install hermione-react```

Enable it in your hermione config file (gemini-babel7 plugin is required for hermione-react work):
### Example
```
    plugins: {
            'gemini-babel7': true,
            'poletay-plugin': {
                port: 8668,
                preparedTestsDir: './prepared-tests',
                webpackConfig: './webpack.dev.config.js'
            }
        },
```
## Options
webpackConfig (required) – path to your webpack config. Plugin will use loaders from this file to build test pages.

port (required) - port to run test server on (server starts on http://localhost).

preparedTestsDir (default is './prepared-tests') - Folder for prepared (wrapped) tests.

## Writing the tests
Import React to use jsx
Variable "template" must contain jsx with the component under test.

Use normal hermione functions to create test instructions.

### Example:
```
import React from 'react';

var template = <div>My component here!</div>;

describe('first-test', function() {
    it('should first time find hermione', function() {
        return this.browser
            .url('/first-test')
            .assertView('plain', '[data-hermione-react]');
    });
});
```
