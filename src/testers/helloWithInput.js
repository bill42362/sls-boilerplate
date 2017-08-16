// helloWithInput.js
'use strict';

const tests = [
    {
        description: 'should respond query parameters, post and path parameters.',
        path: '/hello/100',
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        queries: {q: '1'},
        body: JSON.stringify({bodyParam: 'body param'}),
        expectedResponseStatus: 200,
        expectedResponse: {
            pathParameters: {pathnameInput: '100'},
            queryParameters: {q: '1'},
            postParameters: {bodyParam: 'body param'},
        },
    },
    {
        description: 'should respond query parameters, path parameters and null post.'
            + ' (serverless and express server will behave different)',
        path: '/hello/100',
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        queries: {q: '1'},
        body: JSON.stringify(null),
        expectedResponseStatus: 200,
        expectedResponse: {
            pathParameters: {pathnameInput: '100'},
            queryParameters: {q: '1'},
            postParameters: null,
        },
    },
    {
        description: 'should respond query parameters, path parameters and null post.',
        path: '/hello/100',
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        queries: {q: '1'},
        // body key omitted
        expectedResponseStatus: 200,
        expectedResponse: {
            pathParameters: {pathnameInput: '100'},
            queryParameters: {q: '1'},
            postParameters: null,
        },
    },
];

export default tests;
