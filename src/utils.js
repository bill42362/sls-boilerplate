// utils.js
'use strict';

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
