// ApiDocuments.js
'use strict';
import { processApiTest } from '../../utils.js';
import DocumentData from '../json/document.json';

const defaultState = DocumentData.httpFunctions;

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'CLEAR_ALL_TEST_RESULT':
            return state.map(api => Object.assign({}, api, {tests: api.tests.map(test => {
                return Object.assign({}, test, {isTestSuccess: undefined, testMessages: undefined});
            })}));
            break;
        case 'UPDATE_API_TEST_RESULT':
            const targetApi = state.filter(
                api => action.payload.functionKey === api.functionKey
            )[0];
            if(targetApi && targetApi.tests[action.payload.testIndex]) {
                targetApi.tests[action.payload.testIndex] = Object.assign(
                    {},
                    targetApi.tests[action.payload.testIndex],
                    {
                        isTestSuccess: action.payload.isTestSuccess,
                        testMessages: action.payload.testMessages,
                    }
                );
                return state.map(api => targetApi.functionKey === api.functionKey ? Object.assign({}, targetApi) : api);
            } else {
                return state;
            }
            break;
        case 'UPDATE_API_DOCUMENT':
            const isApiExisted = !!state.filter(
                api => action.payload.documentData.functionKey === api.functionKey
            )[0];
            if(isApiExisted) {
                return state.reduce((current, api) => {
                    if(action.payload.documentData.functionKey === api.functionKey) {
                        return [...current, action.payload.documentData];
                    } else {
                        return [...current, api];
                    }
                }, []);
            } else {
                return [...state, action.payload.documentData];
            }
        default:
            return state;
    }
}

const updateApiDocument = ({ documentData }) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({
            type: 'UPDATE_API_DOCUMENT',
            payload: { documentData },
        });
        resolve({ documentData });
    });
}};

const updateApiTestResult = ({ functionKey, testIndex, isTestSuccess, testMessages }) => {
    return (dispatch, getState) => { return new Promise((resolve, reject) => {
        dispatch({
            type: 'UPDATE_API_TEST_RESULT',
            payload: { functionKey, testIndex, isTestSuccess, testMessages },
        });
    }); };
};

const clearAllTestResult = () => ({type: 'CLEAR_ALL_TEST_RESULT'});

const fetchTest = ({ baseUrl, functionKey, testIndex }) => {
    return (dispatch, getState) => {
        const apiDocuments = getState().apiDocuments;
        if(!apiDocuments) { throw new Error('No apiDocuments found from getState().'); }
        const apiDocument = apiDocuments.filter(apiDocument => functionKey === apiDocument.functionKey)[0];
        if(!apiDocument) { throw new Error('No apiDocument found with given functionKey.'); }
        const apiTest = apiDocument.tests[testIndex];
        if(!apiTest) { throw new Error('No apiTest found with given testIndex.'); }
        return processApiTest({test: apiTest, slsFunctionKey: functionKey, baseUrl })
        .then(testMessages => {
            const isTestSuccess = !!testMessages[1].text.match('^\\s*\\[PASS\\]');
            dispatch(updateApiTestResult({ functionKey, testIndex, isTestSuccess, testMessages }));
        });
    };
};

const fetchAllDocumentTests = ({ baseUrl }) => {
    return (dispatch, getState) => {
        const apiDocuments = getState().apiDocuments;
        if(!apiDocuments) { throw new Error('No apiDocuments found from getState().'); }
        return Promise.all(apiDocuments.reduce((current, apiDocument) => {
            return [...current, apiDocument.tests.map((test, index) => {
                return dispatch(fetchTest({functionKey: apiDocument.functionKey, testIndex: index, baseUrl }));
            })];
        }, []));
    };
};

const Actions = { updateApiDocument, updateApiTestResult, clearAllTestResult, fetchTest, fetchAllDocumentTests };

export default { Reducer, Actions };
