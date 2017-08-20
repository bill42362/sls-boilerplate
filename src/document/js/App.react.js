// App.react.js
'use strict';
import { connect } from 'react-redux';
import React from 'react';
import SideBar from './SideBar.react.js';
import '../css/app.less';

const ConnectedSideBar = connect(
    state => {
        return {
            apiDocuments: state.apiDocuments,
        };
    },
    dispatch => { return {
    }; },
)(SideBar);

class App extends React.Component {
    constructor(props) { super(props); }
    render() {
        return <div className='app'>
            <div className='side-bar-wrapper'>
                <ConnectedSideBar />
            </div>
            <div className='content-wrapper'></div>
        </div>;
    }
}

export default App;
