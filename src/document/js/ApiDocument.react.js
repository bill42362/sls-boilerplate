// ApiDocument.react.js
'use strict';
import { connect } from 'react-redux';
import React from 'react';
import ApiDocuments from './ApiDocuments.js';
import ApiTest from './ApiTest.react.js';
import { badgeTypeMap } from './SharedConsts.js';
import '../css/api-document.less';

const ConnectedApiTest = connect(
    state => { return {
        baseUrl: state.baseUrls.using,
    }; },
    dispatch => { return {
        fetchTest: ({ baseUrl, functionKey, testIndex }) => {
            dispatch(ApiDocuments.Actions.fetchTest({ baseUrl, functionKey, testIndex }))
            .catch(error => { console.log(error); });
        },
    }; },
)(ApiTest);

class ApiDocument extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { apiDocument, baseUrl, fetchAllTest } = this.props;
        const badgeType = badgeTypeMap[apiDocument.method] || badgeTypeMap.default;
        return <div className='api-document'>
            <h2 className='api-key'>
                {apiDocument.functionKey}
                <span className={`api-method-badge badge badge-${badgeType.badgeType}`}>
                    {apiDocument.method.toUpperCase()}
                </span>
                <div className='api-test-all-functions'>
                    <button
                        type='button' className='btn btn-primary'
                        onClick={() => { fetchAllTest({ baseUrl, apiDocument }); }}
                    >Test All</button>
                </div>
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
