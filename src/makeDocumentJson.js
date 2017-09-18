// makeDocumentJson.js
'use strict';
import Yaml from 'js-yaml';
import Fs from 'fs';
import { LOCAL_BASE_URL, AWS_BASE_URL, OTHER_BASE_URLS } from './test.config.js';
import Tester from './tester.js';
import { reformAwsPath } from './utils.js';

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
const documentData = {
    baseUrls: {
        local: LOCAL_BASE_URL,
        aws: AWS_BASE_URL,
        others: OTHER_BASE_URLS,
    },
    httpFunctions,
};

export const makeDocumentJson = () => {
    if(!Fs.existsSync(DOCUMENT_JSON_DIR)){ Fs.mkdirSync(DOCUMENT_JSON_DIR); }
    Fs.writeFileSync(
        `${DOCUMENT_JSON_DIR}/document.json`,
        JSON.stringify(documentData),
        {encoding: 'utf8', flag: 'w+'}
    );
};
export default makeDocumentJson;
