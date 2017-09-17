// ApiTest.react.js
'use strict';
import React from 'react';
import JsonPretty from 'react-json-pretty';
import { getMatchedExpressPath, splitPathByArguments } from '../../utils.js';
import 'react-json-pretty/JSONPretty.monikai.styl';
import '../css/api-test.less';

class ApiTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldFold: true, cardHeight: 'auto',
        };
        this.toggleFolding = this.toggleFolding.bind(this);
        this.fetchTest = this.fetchTest.bind(this);
    }
    updateCardHeight() {
        const { shouldFold } = this.state;
        const headerHeight = this.refs.header.getBoundingClientRect().height;
        const bodyHeight = this.refs.body.getBoundingClientRect().height;
        if(shouldFold) {
            this.setState({cardHeight: headerHeight});
        } else {
            this.setState({cardHeight: headerHeight + bodyHeight});
        }
    }
    toggleFolding() {
        const { shouldFold } = this.state;
        this.setState({shouldFold: !shouldFold});
    }
    fetchTest(e) {
        e.stopPropagation();
        const { baseUrl, apiTest, functionKey, testIndex, fetchTest } = this.props;
        fetchTest({ baseUrl, apiTest, functionKey, testIndex });
        return false;
    }
    componentDidUpdate(prevProps, prevState) {
        if(this.state.shouldFold !== prevState.shouldFold) { this.updateCardHeight(); }
        if(this.props.apiTest.isTestSuccess !== prevProps.apiTest.isTestSuccess) { this.updateCardHeight(); }
    }
    componentDidMount() { this.updateCardHeight(); }
    render() {
        const { baseUrl, apiTest, expressPath, functionKey, testIndex } = this.props;
        const { cardHeight } = this.state;
        const queryKeys = Object.keys(apiTest.queries);
        const queryString = queryKeys.map(queryKey => `${queryKey}=${apiTest.queries[queryKey]}`).join('&');
        const isGetPath = 'get' === apiTest.method.toLowerCase();
        const fullPath = `${baseUrl}${apiTest.path}?${queryString}`;
        const hasQueryString = queryKeys.length;
        const noMatchedClassName = getMatchedExpressPath({targetPath: apiTest.path, expressPath }) ? '' : ' no-match';
        const fragmentedPath = splitPathByArguments({targetPath: apiTest.path, expressPath });
        let cardBorderClassName = '';
        if(apiTest.isTestSuccess) {
            cardBorderClassName = ' border-success';
        } else if(false === apiTest.isTestSuccess) {
            cardBorderClassName = ' border-danger';
        }
        return <div className='api-test'>
            <div className={`card${cardBorderClassName}`} style={{height: cardHeight}}>
                <div className='card-header' ref='header' onClick={this.toggleFolding}>
                    <div className='card-header-content'>
                        <div className='api-test-header-functions'>
                            <button
                                type='button' className='btn btn-primary btn-sm'
                                onClick={this.fetchTest}
                            >Test</button>
                        </div>
                        <div className='api-test-description'>{apiTest.description}</div>
                        <div className='api-test-result'>
                            {true === apiTest.isTestSuccess && <span className='badge badge-success'>PASS</span>}
                            {false === apiTest.isTestSuccess && <span className='badge badge-danger'>FAIL</span>}
                        </div>
                    </div>
                </div>
                <div className='card-body' ref='body'>
                    <h5>Fetch</h5>
                    <table className='table table-sm'>
                        <tbody>
                            <tr className='path'>
                                <th>path</th>
                                <td className={`path-content${noMatchedClassName}`}>
                                    <a href={isGetPath ? fullPath : undefined} target='_blank'>
                                        <span className='base-url'>{baseUrl}</span>
                                        <span className='path'>{fragmentedPath.map((fragment, index) => {
                                            const fragmentClassName = fragment.isArgument ? 'path-argument' : '';
                                            return <span className={fragmentClassName} key={index} >{fragment.display}</span>;
                                        })}</span>
                                        {hasQueryString && <span>?</span>}
                                        {queryKeys.map((queryKey, queryIndex) => {
                                            return <span className='query-string' key={queryIndex}>
                                                <span className='query-key'>{queryKey}</span>
                                                =
                                                <span className='query-value'>{apiTest.queries[queryKey]}</span>
                                                {queryKeys.length !== 1 + queryIndex && '&'}
                                            </span>;
                                        })}
                                    </a>
                                </td>
                            </tr>
                            <tr className='method'>
                                <th>method</th><td className={`${apiTest.method}`}>{apiTest.method}</td>
                            </tr>
                            {!!apiTest.headers && <tr className='headers'>
                                <th>headers</th>
                                <td>
                                    <table className='table table-sm'>
                                        <tbody>
                                            {Object.keys(apiTest.headers).map((headerKey, headerIndex) => {
                                                return <tr className='header' key={headerIndex}>
                                                    <th>{headerKey}</th>
                                                    <td>{apiTest.headers[headerKey]}</td>
                                                </tr>;
                                            })}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>}
                            {!!apiTest.body && <tr className='body'>
                                <th>body</th>
                                <td>
                                    <JsonPretty className='json-pretty' json={apiTest.body} />
                                </td>
                            </tr>}
                        </tbody>
                    </table>
                    <h5>Expected</h5>
                    <table className='table table-sm'>
                        <tbody>
                            <tr className='status'>
                                <th>status</th>
                                <td>
                                    <span className='success'>{apiTest.expectedResponseStatus}</span>
                                </td>
                            </tr>
                            <tr className='body'>
                                <th>body</th>
                                <td>
                                    <JsonPretty className='json-pretty' json={apiTest.expectedResponse} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {!!apiTest.testMessages && <div className='test-messages'>
                        <h5>Test Message</h5>
                        <pre>
                            {apiTest.testMessages.map((message, index) => {
                                return <span
                                    key={index}
                                    style={{color: message.color, backgroundColor: message.color.slice(2)}}
                                >
                                    {message.text}
                                    {message.withNewLine && <br />}
                                </span>;
                            })}
                        </pre>
                    </div>}
                </div>
            </div>
        </div>;
    }
}

export default ApiTest;
