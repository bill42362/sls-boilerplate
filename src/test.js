// test.js
'use strict';
import 'isomorphic-fetch';
import 'colors';
import Yaml from 'js-yaml';
import Fs from 'fs';
import { BASE_URL } from './test.config.js';
import Tester from './tester.js';
const Diff = require('diff');

const slsConfig = Yaml.safeLoad(Fs.readFileSync(`${__dirname}/../serverless.yml`, 'utf8'));
const RESPONSE_STATUS_ERROR = 'RESPONSE_STATUS_ERROR';
const RESPONSE_NOT_FULLFILL = 'RESPONSE_NOT_FULLFILL';

Object.keys(slsConfig.functions).forEach(slsFunctionKey => {
    if(!Tester[slsFunctionKey]) {
        console.log('  Testing of '.gray + `[${slsFunctionKey}]`.cyan + ':'.gray);
        console.log('    ' + '[FAIL]'.bgRed + ' Test not found.'.red);
        return;
    }
    Promise.all(Tester[slsFunctionKey].map(test => { return new Promise((resolve, reject) => {
        const { description, path, method, queries, body, expectedResponseStatus, expectedResponse } = test;
        const queryString = Object.keys(queries).reduce((current, queryKey) => {
            return `${current}&${queryKey}=${queries[queryKey]}`;
        }, '');
        fetch(`${BASE_URL}${path}?${queryString}`, { method, body })
        .then(response => { 
            if(expectedResponseStatus !== response.status) {
                return new Promise((res, rej) => {
                    rej({
                        reason: RESPONSE_STATUS_ERROR,
                        responseStatus: response.status,
                        expectedResponseStatus,
                    });
                });
            } else {
                return response.json();
            }
        })
        .then(response => {
            const responseKeys = Object.keys(response);
            if(JSON.stringify(response) !== JSON.stringify(Object.assign({}, response, expectedResponse))) {
                const result = [];
                result.push(
                    '    ' + '[FAIL]'.bgRed
                        + ' Test of '.red
                        + `[${slsFunctionKey}]`.cyan
                        + ` which `.red + `${description}`.yellow,
                    `      because response not fullfill.`.red
                );
                const responsePropStrings = "      {\n" + Object.keys(response).map(responseKey => {
                    return `        ${responseKey}: ${JSON.stringify(response[responseKey])},`;
                }).join("\n") + "\n      }";
                const expectedResponsePropStrings = "      {\n" + Object.keys(expectedResponse).map(expectedResponseKey => {
                    return `        ${expectedResponseKey}: ${JSON.stringify(expectedResponse[expectedResponseKey])},`;
                }).join("\n") + "\n      }";
                const diff = Diff.diffLines(expectedResponsePropStrings, responsePropStrings, {newlineIsToken: true});
                diff.forEach(line => {
                    if("\n" === line.value) { return; }
                    const color = line.added ? 'green' : line.removed ? 'red' : 'grey';
                    result.push((line.value.replace(/^\n/, '').replace(/\n$/, ''))[color]);
                });
                return new Promise((res, rej) => {
                    rej({reason: RESPONSE_NOT_FULLFILL, result });
                });
            } else {
               const result = '    ' + '[PASS]'.bgGreen
                    + ` Test of `.gray
                    + `[${slsFunctionKey}]`.cyan
                    + ` which `.gray + `${description}`.yellow;
                resolve([result]);
            }
        })
        .catch(error => {
            if(RESPONSE_STATUS_ERROR === error.reason) {
                resolve([
                    '    ' + '[FAIL]'.bgRed
                        + `Test of `.gray + `[${slsFunctionKey}]`.cyan
                        + ` which `.gray + `${description}`.yellow,
                    `      because respond wrong status.`.red,
                    `      expectedResponseStatus: ${error.expectedResponseStatus}`.green,
                    `      responseStatus: ${error.responseStatus}`.red
                ]);
            } else if(RESPONSE_NOT_FULLFILL === error.reason) {
                resolve(error.result);
            } else {
                resolve([
                    '    ' + '[FAIL]'.bgRed
                        + ` Test of `.gray + `[${slsFunctionKey}]`.cyan
                        + ` which `.gray + `${description}`.yellow,
                    '      because api call error.'.red,
                    `      error: ${error}`.red
                ]);
            }
        });
    }); }))
    .then(testResults => {
        console.log('  Testing of '.gray + `[${slsFunctionKey}]`.cyan + ':'.gray);
        testResults.forEach(testResult => {
            testResult.forEach(testResultLine => {
                console.log(testResultLine);
            });
        });
    })
    .catch(error => { console.log(error); });
});
