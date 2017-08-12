// index.js
'use strict';
import Express from 'express';
import Yaml from 'js-yaml';
import Fs from 'fs';

import SlsHandler from './handler.js';
 
const PORT = process.env.PORT || '3000';
const slsConfig = Yaml.safeLoad(Fs.readFileSync(`${__dirname}/../serverless.yml`, 'utf8'));
const server = Express();

Object.keys(slsConfig.functions).forEach(slsFunctionKey => {
    const slsFunction = slsConfig.functions[slsFunctionKey];

    // Get handler function with .yml config.
    const handlerKey = slsFunction.handler.replace(/^dist.handler\./, '');
    if(!SlsHandler[handlerKey]) { console.log('Handler not found. handler:', handlerKey); return; }
    const handler = SlsHandler[handlerKey];

    // Get http event settings.
    const httpEventObject = slsFunction.events.filter(event => !!event.http)[0];
    if(!httpEventObject) { console.log('Function not process http event. function:', slsFunctionKey); return; }
    const httpEvent = httpEventObject.http;
    const httpMethod = httpEvent.method || 'get';

    // Reform pathname parameter syntax from aws style (/{param}) to express style (/:param).
    const pathTemplate = httpEvent.path;
    let reformedPath = `/${pathTemplate}`;
    const matchedPathArgs = pathTemplate.match(/\/{([^\.}]+)}/ig);
    if(matchedPathArgs) {
        matchedPathArgs.forEach(pathArg => {
            reformedPath = reformedPath.replace(pathArg, pathArg.replace('{', ':').replace('}', ''));
        });
    }

    server[httpMethod](reformedPath, (request, response, next) => {
        handler(
            {pathParameters: request.params},
            null,
            (error, handlerResponse) => {
                if(error) {
                    response.status(500);
                    response.send({
                        errorMessage: error.message,
                        errorType: error.name,
                    });
                } else {
                    response.status(handlerResponse.statusCode);
                    response.send(handlerResponse.body);
                }
            }
        );
    });
});

server.listen(PORT);
