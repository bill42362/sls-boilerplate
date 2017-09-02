// ApiDocuments.js
'use strict';
import DocumentData from '../json/document.json';

const defaultState = DocumentData.httpFunctions;

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
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

const Actions = { updateApiDocument, updateApiTestResult };

export default { Reducer, Actions };
