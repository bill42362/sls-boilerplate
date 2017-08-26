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
