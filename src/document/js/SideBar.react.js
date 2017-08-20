// SideBar.react.js
'use strict';
import React from 'react';
import { badgeTypeMap } from './SharedConsts.js';
import '../css/side-bar.less';

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
