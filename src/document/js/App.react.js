// App.react.js
'use strict';
import { connect } from 'react-redux';
import React from 'react';
import { processApiTest } from '../../utils.js';
import SideBar from './SideBar.react.js';
import BaseUrls from './BaseUrls.js';
import BaseUrlComponent from './BaseUrl.react.js';
import ApiDocuments from './ApiDocuments.js';
import ApiDocumentComponent from './ApiDocument.react.js';
import '../css/app.less';

const ConnectedSideBar = connect(
    state => { return {
        apiDocuments: state.apiDocuments,
    }; },
    dispatch => { return { }; },
)(SideBar);

const ConnectedBaseUrl = connect(
    state => { return Object.assign({}, state.baseUrls); },
    dispatch => { return {
        updateUsingUrl: ({ url }) => {
            dispatch(BaseUrls.Actions.updateUsingUrl({ url }))
            .catch(error => { console.log(error); });
        },
    }; },
)(BaseUrlComponent);

const ConnectedApiDocument = connect(
    (state, ownProps) => { return {
        baseUrl: state.baseUrls.using,
    }; },
    dispatch => { return {
        fetchAllTest: ({ baseUrl, apiDocument }) => {
            Promise.all(apiDocument.tests.map(test => {
                return processApiTest({slsFunctionKey: apiDocument.functionKey, baseUrl, test });
            }))
            .then(testMessagesOfAllTests => {
                return Promise.all(testMessagesOfAllTests.map((testMessages, index) => {
                    const isTestSuccess = !!testMessages[0].match('^\\s*\\[PASS\\]');
                    return dispatch(ApiDocuments.Actions.updateApiTestResult({
                        testIndex: index, functionKey: apiDocument.functionKey,
                        isTestSuccess, testMessages
                    }));
                }))
            })
            .catch(error => { console.log(error); });
        },
    }; },
)(ApiDocumentComponent);

class App extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { apiDocuments } = this.props;
        return <div className='app'>
            <div className='side-bar-wrapper'>
                <ConnectedSideBar />
            </div>
            <div className='content-wrapper'>
                <div className='base-url-wrapper'>
                    <a className='in-site-anchor' id='base-url-anchor'/>
                    <ConnectedBaseUrl />
                </div>
                <div className='api-documents-wrapper'>
                    {apiDocuments.map((apiDocument, index) => {
                        return <div className='api-document-wrapper' key={index}>
                            <a className='in-site-anchor' id={`${apiDocument.functionKey}-anchor`}/>
                            <ConnectedApiDocument apiDocument={apiDocument} />
                        </div>;
                    })}
                </div>
            </div>
        </div>;
    }
}

export default App;
