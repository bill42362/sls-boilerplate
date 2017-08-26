// BaseUrls.js
'use strict';
import DocumentData from '../json/document.json';

const defaultState = Object.assign({}, DocumentData.baseUrls, {using: DocumentData.baseUrls.local});

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_USING_BASE_URL':
            return Object.assign({}, state, {using: action.payload.url});
        case 'ADD_OTHER_BASE_URL':
            return Object.assign({}, state, {others: [...state.others, action.payload.url]});
        case 'REMOVE_OTHER_BASE_URL':
            return state;
        default:
            return state;
    }
}

const addOtherUrl = ({ url }) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({
            type: 'ADD_OTHER_BASE_URL',
            payload: { url },
        });
        resolve({ url });
    });
}; };

const updateUsingUrl = ({ url }) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({
            type: 'UPDATE_USING_BASE_URL',
            payload: { url },
        });
        resolve({ url });
    });
}; };

const Actions = { addOtherUrl, updateUsingUrl };

export default { Reducer, Actions };
