// SideBar.react.js
'use strict';
import React from 'react';
import { badgeTypeMap } from './SharedConsts.js';
import '../css/side-bar.less';

const activeAnchorClassName = ' list-group-item-primary';

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {topAnchorId: 'base-url-anchor'};
        this.onScroll = this.onScroll.bind(this);
    }
    getElementDistanceToScreenTop(element) {
        const clientRect = element.getBoundingClientRect();
        const elementCenter = 0.5*(clientRect.top + clientRect.bottom);
        return Math.abs(elementCenter);
    }
    getTopAnchorId({ anchors }) {
        const anchorOnScreenResults = anchors.map(function(anchor) {
            return {element: anchor, distanceToScreenTop: this.getElementDistanceToScreenTop(anchor)};
        }, this);
        const topAnchor = anchorOnScreenResults.reduce(function(a, b) {
            if(a.distanceToScreenTop > b.distanceToScreenTop) { return b; }
            else { return a; }
        }, anchorOnScreenResults[0]);
        return topAnchor.element.id;
    }
    onScroll() {
        const currentTopAnchorId = this.state.topAnchorId;
        const anchors = Array.prototype.slice.call(document.getElementsByClassName('in-site-anchor'));
        const topAnchorId = this.getTopAnchorId({ anchors });
        if(currentTopAnchorId !== topAnchorId) { this.setState({ topAnchorId }); }
    }
    componentDidMount() { window.addEventListener('scroll', this.onScroll, false); }
    componentWillUnmount() { window.removeEventListener('scroll', this.onScroll); }
    render() {
        const { topAnchorId } = this.state;
        const { apiDocuments } = this.props;
        const baseUrlTopAnchorClassName = topAnchorId === 'base-url-anchor' ? activeAnchorClassName : '';
        return <div className='side-bar'>
            <div className='anchor-list list-group'>
                <a
                    className={`base-url-item list-group-item${baseUrlTopAnchorClassName}`}
                    href='#base-url-anchor'
                >Base Url</a>
                {apiDocuments.map((apiDocument, index) => {
                    const badgeType = badgeTypeMap[apiDocument.method] || badgeTypeMap.default;
                    const anchorKey = `${apiDocument.functionKey}-anchor`;
                    const topAnchorClassName = topAnchorId === anchorKey ? activeAnchorClassName : '';
                    let isApiTestPassed = null;
                    if(apiDocument.tests.length === apiDocument.tests.filter(test => test.isTestSuccess).length) {
                        isApiTestPassed = true;
                    } else if(0 !== apiDocument.tests.filter(test => false === test.isTestSuccess).length) {
                        isApiTestPassed = false;
                    }
                    return <a
                        className={`api-key-item list-group-item${topAnchorClassName}`}
                        key={index} href={`#${anchorKey}`}
                    >
                        <div className='api-display'>
                            <span className={`api-method-badge badge badge-${badgeType.badgeType}`}>
                                {badgeType.display || apiDocument.method}
                            </span>
                            {apiDocument.functionKey}
                        </div>
                        <div className='api-test-result'>
                            {isApiTestPassed && <span className='badge badge-success'>PASS</span>}
                            {false === isApiTestPassed && <span className='badge badge-danger'>FAIL</span>}
                        </div>
                    </a>;
                })}
            </div>
        </div>;
    }
}

export default SideBar;
