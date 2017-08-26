// index.js
'use strict';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import BaseUrls from './BaseUrls.js';
import ApiDocuments from './ApiDocuments.js';
import App from './App.react.js';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/index.less';

const reducer = combineReducers({
    baseUrls: BaseUrls.Reducer,
    apiDocuments: ApiDocuments.Reducer,
})
const store = createStore(reducer, applyMiddleware(ReduxThunk));

const ConnectedApp = connect(
    state => {
        return {
            apiDocuments: state.apiDocuments,
        };
    },
    dispatch => { return {
    }; },
)(App);

ReactDOM.render(
    <Provider store={store} >
        <ConnectedApp />
    </Provider>,
    document.getElementById('app-root')
);
