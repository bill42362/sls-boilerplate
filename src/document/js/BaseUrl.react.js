// BaseUrl.react.js
'use strict';
import React from 'react';
import '../css/base-url.less';

class BaseUrl extends React.Component {
    constructor(props) {
        super(props);
        this.updateUsingUrl = this.updateUsingUrl.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }
    updateUsingUrl(e) {
        const { updateUsingUrl } = this.props;
        const url = e.target.getAttribute('data-url');
        if(url && updateUsingUrl) { updateUsingUrl({ url }); }
    }
    onKeyUp(e) {
        if('T' === e.key) {
            const { using, fetchAllDocumentTests } = this.props;
            fetchAllDocumentTests({baseUrl: using});
        }
    }
    componentDidMount() { window.addEventListener('keyup', this.onKeyUp, false); }
    componentWillUnmount() { window.removeEventListener('keyup', this.onKeyUp, false); }
    render() {
        const {
            local, aws, others, addons, using,
            addEmptyAddonUrl, updateAddonUrl, removeAddonUrl, fetchAllDocumentTests
        } = this.props;
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
                {addons.map((addonUrl, index) => {
                    const usingClassName = addonUrl === using ? ' using' : '';
                    return <li className='list-group-item' key={index}>
                        <div className='base-url-url'>
                            <div
                                className={`base-url-url-title${usingClassName}`}
                                data-url={addonUrl} onClick={this.updateUsingUrl}
                            >{`Addon ${index}`}</div>
                            <div className='base-url-url-display'>
                                <div className='base-url-addon-url-input input-group'>
                                    <input
                                        type='text' className='form-control'
                                        placeholder='New base url' aria-label='New base url'
                                        value={addonUrl}
                                        onChange={(e) => { updateAddonUrl({url: e.target.value, index }); }}
                                    />
                                </div>
                                <div className='base-url-addon-url-delete input-group'>
                                    <button
                                        type='button' className='btn btn-sm btn-outline-dark'
                                        onClick={(e) => { removeAddonUrl({ index }); }}
                                    >X</button>
                                </div>
                            </div>
                        </div>
                    </li>;
                })}
                <li className='list-group-item'>
                    <div className='base-url-functions'>
                        <button
                            type='button' className='add-new-url-button btn btn-sm btn-outline-dark'
                            onClick={addEmptyAddonUrl}
                        >+</button>
                        <button
                            type='button' className='test-all-functions-button btn btn-sm btn-primary'
                            onClick={() => fetchAllDocumentTests({baseUrl: using})}
                        >
                            Test all functions
                            <span className='hot-key-display'>Hotkey: T</span>
                        </button>
                    </div>
                </li>
            </ul>
        </div>;
    }
}

export default BaseUrl;
