// document.js
'use strict';
import Yaml from 'js-yaml';
import Fs from 'fs';
import Express from 'express';
import Tester from './tester.js';
import { reformAwsPath } from './utils.js';

const isProd = process.env.NODE_ENV === 'production';
const WEB_PORT = process.env.PORT || 5566;
const DOCUMENT_JSON_DIR = `${__dirname}/document/json`;
const slsConfig = Yaml.safeLoad(Fs.readFileSync(`${__dirname}/../serverless.yml`, 'utf8'));

// Create document.json for front-end data.
const getHttpFunctions = (functionKey) => {
    const functionConfig = slsConfig.functions[functionKey];
    const functionEventsWithHttp = functionConfig.events.filter(event => !!event.http)[0];
    let result = undefined;
    if(!!functionEventsWithHttp) {
        const httpEvent = functionEventsWithHttp.http;
        result = {
            functionKey,
            method: httpEvent.method,
            awsPath: `/${httpEvent.path}`,
            expressPath: reformAwsPath(httpEvent.path),
            tests: Tester[functionKey],
        };
    }
    return result;
};
const httpFunctions = Object.keys(slsConfig.functions)
    .map(getHttpFunctions)
    .filter(functionData => !!functionData);
const documentData = { httpFunctions };
if(!Fs.existsSync(DOCUMENT_JSON_DIR)){ Fs.mkdirSync(DOCUMENT_JSON_DIR); }
Fs.writeFileSync(
    `${DOCUMENT_JSON_DIR}/document.json`,
    JSON.stringify(documentData),
    {encoding: 'utf8', flag: 'w+'}
);

const expressStaticRoutes = [
    {path: '/css/', serverPath: '/document/css'},
    {path: '/json/', serverPath: '/document/json'},
    {path: '/js/', serverPath: '/document/js'},
];
const renderApp = `
    <!doctype html>
    <html>
        <head>
            <title>${slsConfig.service}</title>
        </head>
        <body>
            <div id="app-root"></div>
            <script type='text/javascript' src="${isProd ? `/js/bundle.js` : `http://localhost:7000/js/bundle.js`}" ></script>
        </body>
    </html>
`;
const app = Express();

app.get('/', (req, res) => { res.send(renderApp); })
expressStaticRoutes.forEach(function(route) {
    app.use(route.path, Express.static(__dirname + route.serverPath));
});
app.listen(WEB_PORT);
