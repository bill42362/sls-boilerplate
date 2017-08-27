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
            <div className='anchor-list list-group'>
                <a className='base-url-item list-group-item' href='#base-url-anchor'>Base Url</a>
                {apiDocuments.map((apiDocument, index) => {
                    const badgeType = badgeTypeMap[apiDocument.method] || badgeTypeMap.default;
                    return <a
                        className='api-key-item list-group-item' key={index}
                        href={`#${apiDocument.functionKey}-anchor`}
                    >
                        <span className={`api-method-badge badge badge-${badgeType.badgeType}`}>
                            {badgeType.display || apiDocument.method}
                        </span>
                        {apiDocument.functionKey}
                    </a>;
                })}
            </div>
        </div>;
    }
}

export default SideBar;
