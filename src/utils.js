// utils.js
'use strict';
import 'colors';
import 'isomorphic-fetch';
const Diff = require('diff');

const RESPONSE_STATUS_ERROR = 'RESPONSE_STATUS_ERROR';
const RESPONSE_NOT_FULLFILL = 'RESPONSE_NOT_FULLFILL';

export const reformAwsPath = (awsPath) => {
    let reformedPath = `/${awsPath}`;
    const matchedPathArgs = awsPath.match(/\/{([^\.}]+)}/ig);
    if(matchedPathArgs) {
        matchedPathArgs.forEach(pathArg => {
            reformedPath = reformedPath.replace(pathArg, pathArg.replace('{', ':').replace('}', ''));
        });
    }
    return reformedPath;
}

export const getMatchedExpressPath = ({ expressPath, targetPath }) => {
    const pathRegexp = expressPath.replace(/:[^\/]+/g, '([^\\/]+)');
    return targetPath.match(pathRegexp);
}

export const splitPathByArguments = ({ expressPath, targetPath }) => {
    let result = [{isArgument: false, display: targetPath}];
    const matchedPathArgDefines = expressPath.match(/:[^\/]+/g);
    if(matchedPathArgDefines) {
        const noneArgFragments = matchedPathArgDefines.reduce((current, argDefine) => {
            return current.replace(argDefine, ':__arg__:');
        }, expressPath).split(':__arg__:');
        const matchedExpressPath = getMatchedExpressPath({ expressPath, targetPath });
        if(!!matchedExpressPath) {
            const argFragments = matchedExpressPath.slice(1);
            result = argFragments.reduce((current, argFragment, index) => {
                return [
                    ...current,
                    {isArgument: true, display: argFragment},
                    {isArgument: false, display: noneArgFragments[index + 1]}
                ];
            }, [{isArgument: false, display: noneArgFragments[0]}]);
        }
    }
    return result;
}

export const processApiTest = ({ test, baseUrl, slsFunctionKey }) => { return new Promise((resolve, reject) => {
    const { description, path, method, queries, headers, body, expectedResponseStatus, expectedResponse } = test;
    const queryString = Object.keys(queries).reduce((current, queryKey) => {
        return `${current}&${queryKey}=${queries[queryKey]}`;
    }, '');
    fetch(`${baseUrl}${path}?${queryString}`, { method, headers, body })
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
}); }
