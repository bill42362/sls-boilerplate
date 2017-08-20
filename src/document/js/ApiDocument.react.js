// ApiDocument.react.js
'use strict';
import React from 'react';
import ApiTest from './ApiTest.react.js';
import { badgeTypeMap } from './SharedConsts.js';
import '../css/api-document.less';

class ApiDocument extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { apiDocument } = this.props;
        const badgeType = badgeTypeMap[apiDocument.method] || badgeTypeMap.default;
        return <div className='api-document'>
            <h2 className='api-key'>
                {apiDocument.functionKey}
                <span className={`api-method-badge badge badge-${badgeType.badgeType}`}>
                    {apiDocument.method.toUpperCase()}
                </span>
            </h2>
            <div className='api-path card text-white bg-dark'>
                <div className='card-body'>
                    {apiDocument.expressPath}
                </div>
            </div>
            <div className='api-tests'>
                {apiDocument.tests.map((test, index) => {
                    return <ApiTest key={index} apiTest={test} />;
                })}
            </div>
        </div>;
    }
}

export default ApiDocument;
