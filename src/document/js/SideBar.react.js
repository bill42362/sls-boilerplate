// SideBar.react.js
'use strict';
import React from 'react';
import '../css/side-bar.less';

const badgeTypeMap = {
    get: {badgeType: 'primary', display: 'GET'},
    post: {badgeType: 'success', display: 'POS'},
    put: {badgeType: 'success', display: 'PUT'},
    option: {badgeType: 'info', display: 'OPT'},
    delete: {badgeType: 'danger', display: 'DEL'},
    default: {badgeType: 'secondary'},
};

class SideBar extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { apiDocuments } = this.props;
        return <div className='side-bar'>
            <ul className='api-key-list list-group'>
                {apiDocuments.map((apiDocument, index) => {
                    const badgeType = badgeTypeMap[apiDocument.method] || badgeTypeMap.default;
                    return <li className='api-key-item list-group-item' key={index}>
                        <span className={`api-method-badge badge badge-${badgeType.badgeType}`}>
                            {badgeType.display || apiDocument.method}
                        </span>
                        {apiDocument.functionKey}
                    </li>;
                })}
            </ul>
        </div>;
    }
}

export default SideBar;
