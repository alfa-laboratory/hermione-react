const fs = require('fs');
const path = require('path');

const prepareTest = (testFileFullName, preparedTestsDir) => {
    const testFileName = path.basename(testFileFullName);
    const preparedTestFileName = `prepared-${testFileName}`;
    const preparedTestRelativeName = path.join(preparedTestsDir, preparedTestFileName);

    const requires = `
        var ReactDOM = require('react-dom');
        window.describe = function() {};
        window.it = function() {};
    `;

    const render = `
        const elem = document.querySelector('[data-hermione-react]');
        ReactDOM.render(template, elem);
        elem.style.color = 'red';
    `;

    const test = fs.readFileSync(testFileFullName, 'utf8');

    // TODO: async write
    fs.writeFileSync(
        preparedTestRelativeName,
        `${requires}
        ${test}
        ${render}`,
        'utf8',
    );

    return preparedTestRelativeName;
};

module.exports = prepareTest;
