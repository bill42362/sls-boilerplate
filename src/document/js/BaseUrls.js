// BaseUrls.js
'use strict';
import DocumentData from '../json/document.json';

const defaultState = Object.assign({}, DocumentData.baseUrls, {
    using: DocumentData.baseUrls.local,
    addons: [],
});

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_USING_BASE_URL':
            return Object.assign({}, state, {using: action.payload.url});
        case 'ADD_ADDON_BASE_URL':
            return Object.assign({}, state, {addons: [...state.addons, action.payload.url]});
        case 'UPDATE_ADDON_BASE_URL':
            return Object.assign({}, state, {addons: [
                ...state.addons.slice(0, action.payload.index),
                action.payload.url,
                ...state.addons.slice(action.payload.index + 1),
            ]});
        case 'REMOVE_ADDON_BASE_URL':
            return Object.assign({}, state, {addons: [
                ...state.addons.slice(0, action.payload.index),
                ...state.addons.slice(action.payload.index + 1),
            ]});
            return state;
        default:
            return state;
    }
}

const addAddonUrl = ({ url }) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({
            type: 'ADD_ADDON_BASE_URL',
            payload: { url },
        });
        resolve({ url });
    });
}; };

const updateAddonUrl = ({ url, index }) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({
            type: 'UPDATE_ADDON_BASE_URL',
            payload: { url, index },
        });
        resolve({ url, index });
    });
}; };

const removeAddonUrl = ({ index }) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({
            type: 'REMOVE_ADDON_BASE_URL',
            payload: { index },
        });
        resolve({ index });
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

const Actions = { addAddonUrl, updateAddonUrl, removeAddonUrl, updateUsingUrl };

export default { Reducer, Actions };
