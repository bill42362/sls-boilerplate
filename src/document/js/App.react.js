// App.react.js
'use strict';
import { connect } from 'react-redux';
import React from 'react';
import SideBar from './SideBar.react.js';
import BaseUrls from './BaseUrls.js';
import BaseUrlComponent from './BaseUrl.react.js';
import ApiDocument from './ApiDocument.react.js';
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
                    <ConnectedBaseUrl />
                </div>
                <div className='api-document-wrapper'>
                    {apiDocuments.map((apiDocument, index) => {
                        return <ApiDocument key={index} apiDocument={apiDocument} />;
                    })}
                </div>
            </div>
        </div>;
    }
}

export default App;
