// ApiDocument.react.js
'use strict';
import { connect } from 'react-redux';
import React from 'react';
import { processApiTest } from '../../utils.js';
import ApiDocuments from './ApiDocuments.js';
import ApiTest from './ApiTest.react.js';
import { badgeTypeMap } from './SharedConsts.js';
import '../css/api-document.less';

const ConnectedApiTest = connect(
    state => { return {
        baseUrl: state.baseUrls.using,
    }; },
    dispatch => { return {
        fetchTest: ({ baseUrl, apiTest, functionKey, testIndex }) => {
            processApiTest({test: apiTest, slsFunctionKey: functionKey, baseUrl })
            .then(testMessages => {
                const isTestSuccess = !!testMessages[0].match('^\\s*\\[PASS\\]');
                dispatch(ApiDocuments.Actions.updateApiTestResult({
                    functionKey, testIndex, isTestSuccess, testMessages
                }));
            })
            .catch(error => { console.log(error); });
        },
    }; },
)(ApiTest);

class ApiDocument extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { apiDocument } = this.props;
        const badgeType = badgeTypeMap[apiDocument.method] || badgeTypeMap.default;
        return <div className='api-document'>
            <h2 className='api-key'>
                {apiDocument.functionKey}
                <span className={`api-method-badge badge badge-${badgeType.badgeType}`}>
                    {apiDocument.method.toUpperCase()}
                </span>
            </h2>
            <div className='api-path card text-white bg-dark'>
                <div className='card-body'>
                    {apiDocument.expressPath}
                </div>
            </div>
            <div className='api-tests'>
                {apiDocument.tests.map((test, index) => {
                    return <ConnectedApiTest
                        key={index} apiTest={test} testIndex={index}
                        functionKey={apiDocument.functionKey}
                        expressPath={apiDocument.expressPath}
                    />;
                })}
            </div>
        </div>;
    }
}

export default ApiDocument;
