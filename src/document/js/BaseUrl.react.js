// BaseUrl.react.js
'use strict';
import React from 'react';
import '../css/base-url.less';

class BaseUrl extends React.Component {
    constructor(props) {
        super(props);
        this.updateUsingUrl = this.updateUsingUrl.bind(this);
    }
    updateUsingUrl(e) {
        const { updateUsingUrl } = this.props;
        const url = e.target.getAttribute('data-url');
        if(url && updateUsingUrl) { updateUsingUrl({ url }); }
    }
    render() {
        const { local, aws, others, using } = this.props;
        const usingLocalClassName = local === using ? ' using' : '';
        const usingAwsClassName = aws === using ? ' using' : '';
        return <div className='base-url'>
            <h2 className='base-url-header'>Base Url</h2>
            <ul className='list-group'>
                <li className='list-group-item'>
                    <div className='base-url-url'>
                        <div
                            className={`base-url-url-title${usingLocalClassName}`}
                            data-url={local} onClick={this.updateUsingUrl}
                        >Local</div>
                        <div className='base-url-url-display'>{local}</div>
                    </div>
                </li>
                <li className='list-group-item'>
                    <div className='base-url-url'>
                        <div
                            className={`base-url-url-title${usingAwsClassName}`}
                            data-url={aws} onClick={this.updateUsingUrl}
                        >AWS</div>
                        <div className='base-url-url-display'>{aws}</div>
                    </div>
                </li>
                {others.map((otherUrl, index) => {
                    const usingClassName = otherUrl.url === using ? ' using' : '';
                    return <li className='list-group-item' key={index}>
                        <div className='base-url-url'>
                            <div
                                className={`base-url-url-title${usingClassName}`}
                                data-url={otherUrl.url} onClick={this.updateUsingUrl}
                            >{otherUrl.title}</div>
                            <div className='base-url-url-display'>{otherUrl.url}</div>
                        </div>
                    </li>;
                })}
            </ul>
        </div>;
    }
}

export default BaseUrl;
