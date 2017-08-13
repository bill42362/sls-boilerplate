// test.js
'use strict';
import 'isomorphic-fetch';
import Yaml from 'js-yaml';
import Fs from 'fs';

import Tester from './tester.js';

const slsConfig = Yaml.safeLoad(Fs.readFileSync(`${__dirname}/../serverless.yml`, 'utf8'));

Object.keys(slsConfig.functions).forEach(slsFunctionKey => {
    if(!Tester[slsFunctionKey]) { console.log(`${slsFunctionKey} has no test. :(`); return; }
    Tester[slsFunctionKey].map(test => {
        const { description, url, method, queries, body, expectedResponseStatus, expectedResponse } = test;
        const queryString = Object.keys(queries).reduce((current, queryKey) => {
            return `${current}&${queryKey}=${queries[queryKey]}`;
        }, '');

        fetch(`${url}?${queryString}`, { method, body })
        .then(response => { 
            if(expectedResponseStatus !== response.status) {
                console.log(
                    `Respond wrong status.`,
                    `While testing ${slsFunctionKey} which ${description}`,
                    "\n  expectedResponseStatus:", expectedResponseStatus,
                    "\n  response.status:", response.status
                );
            }
            return response.json();
        })
        .then(response => {
            const responseKeys = Object.keys(response);
            Object.keys(expectedResponse).forEach(expectedResponseKey => {
                if(-1 === responseKeys.indexOf(expectedResponseKey)) {
                    console.log(
                        `Expected response key not found.`,
                        `While testing ${slsFunctionKey} which ${description}`,
                        "\n  expectedResponseKey:", expectedResponseKey,
                        "\n  expectedResponse:", expectedResponse,
                        "\n  response:", response
                    );
                    return;
                }
            });
        })
        .catch(error => {
            console.log(
                `API call error.`,
                `While testing ${slsFunctionKey} which ${description}`,
                "\n  error:", error
            );
        });
    });
});
