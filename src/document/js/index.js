// index.js
'use strict';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import ApiDocuments from './ApiDocuments.js';
import App from './App.react.js';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/index.less';

const reducer = combineReducers({
    apiDocuments: ApiDocuments.Reducer,
})
const store = createStore(reducer, applyMiddleware(ReduxThunk));

ReactDOM.render(
    <Provider store={store} >
        <App />
    </Provider>,
    document.getElementById('app-root')
);
