// test.js
'use strict';
import 'colors';
import Yaml from 'js-yaml';
import Fs from 'fs';
import { BASE_URL } from './test.config.js';
import { processApiTest } from './utils.js';
import Tester from './tester.js';

const slsConfig = Yaml.safeLoad(Fs.readFileSync(`${__dirname}/../serverless.yml`, 'utf8'));

Object.keys(slsConfig.functions).forEach(slsFunctionKey => {
    if(!Tester[slsFunctionKey]) {
        console.log('  Testing of '.gray + `[${slsFunctionKey}]`.cyan + ':'.gray);
        console.log('    ' + '[FAIL]'.bgRed + ' Test not found.'.red);
        return;
    }
    Promise.all(Tester[slsFunctionKey].map(test => {
        return processApiTest({baseUrl: BASE_URL, slsFunctionKey, test });
    }))
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
