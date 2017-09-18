// document.js
'use strict';
import Yaml from 'js-yaml';
import Fs from 'fs';
import Express from 'express';
import { makeDocumentJson } from './makeDocumentJson.js';

const isProd = process.env.NODE_ENV === 'production';
const WEB_PORT = process.env.PORT || 5566;
const slsConfig = Yaml.safeLoad(Fs.readFileSync(`${__dirname}/../serverless.yml`, 'utf8'));

makeDocumentJson();

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
