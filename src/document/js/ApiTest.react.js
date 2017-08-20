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
        return <div className='api-test'>
            <div className='card' style={{height: cardHeight}} onClick={this.toggleFolding}>
                <div className='card-header' ref='header'>
                    {apiTest.description}
                </div>
                <div className='card-body' ref='body'>
                </div>
            </div>
        </div>;
    }
}

export default ApiTest;
