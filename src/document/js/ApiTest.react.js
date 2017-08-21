// ApiTest.react.js
'use strict';
import React from 'react';
import '../css/api-test.less';

class ApiTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldFold: true, cardHeight: 'auto',
        };
        this.toggleFolding = this.toggleFolding.bind(this);
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
    componentDidUpdate(prevProps, prevState) {
        if(this.state.shouldFold !== prevState.shouldFold) { this.updateCardHeight(); }
    }
    componentDidMount() { this.updateCardHeight(); }
    render() {
        const { apiTest } = this.props;
        const { cardHeight } = this.state;
        const queryKeys = Object.keys(apiTest.queries);
        const hasQueryString = queryKeys.length;
        return <div className='api-test'>
            <div className='card' style={{height: cardHeight}} onClick={this.toggleFolding}>
                <div className='card-header' ref='header'>
                    {apiTest.description}
                </div>
                <div className='card-body' ref='body'>
                    <h5>Fetch</h5>
                    <table className='table table-sm'>
                        <tbody>
                            <tr className='path'>
                                <th>path</th>
                                <td>
                                    <span className='path'>{`${apiTest.path}`}</span>
                                    {hasQueryString && <span>?</span>}
                                    {queryKeys.map((queryKey, queryIndex) => {
                                        return <span className='query-string' key={queryIndex}>
                                            <span className='query-key'>{queryKey}</span>
                                            =
                                            <span className='query-value'>{apiTest.queries[queryKey]}</span>
                                            {queryKeys.length !== 1 + queryIndex && '&'}
                                        </span>;
                                    })}
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
                                <td>{apiTest.body}</td>
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
                                    <span className=''>{JSON.stringify(apiTest.expectedResponse)}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>;
    }
}

export default ApiTest;
