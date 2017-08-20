// ApiDocuments.js
'use strict';
import DocumentData from '../json/document.json';

const defaultState = DocumentData.httpFunctions;

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_API_DOCUMENT':
            const isApiExisted = !!state.filter(
                api => action.documentData.functionKey === api.functionKey
            )[0];
            if(isApiExisted) {
                return state.reduce((current, api) => {
                    if(action.documentData.functionKey === api.functionKey) {
                        return [...current, action.documentData];
                    } else {
                        return [...current, api];
                    }
                }, []);
            } else {
                return [...state, action.documentData];
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

const Actions = { updateApiDocument };

export default { Reducer, Actions };
