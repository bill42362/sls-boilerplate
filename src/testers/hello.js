// hello.js
'use strict';

const tests = [
    {
        description: 'should respond query parameters with null post and path parameters.',
        path: '/hello',
        method: 'get',
        queries: {q: '1'},
        body: null,
        expectedResponseStatus: 200,
        expectedResponse: {
            pathParameters: null,
            queryParameters: {q: '1'},
            postParameters: null,
        },
    },
    {
        description: 'should fail because api call error.',
        path: '/hello',
        method: 'got',
        queries: {q: '1'},
        body: null,
        expectedResponseStatus: 200,
        expectedResponse: {
            pathParameters: null,
            queryParameters: {q: '1'},
            postParameters: null,
        },
    },
    {
        description: 'should fail because respond wrong status.',
        path: '/hello',
        method: 'get',
        queries: {q: '1'},
        body: null,
        expectedResponseStatus: 400,
        expectedResponse: {
            pathParameters: null,
            queryParameters: {q: '1'},
            postParameters: null,
        },
    },
    {
        description: 'should fail because response not fullfill.',
        path: '/hello',
        method: 'get',
        queries: {q: '1'},
        body: null,
        expectedResponseStatus: 200,
        expectedResponse: {
            aa: null,
            pathParameters: null,
            queryParameters: {q: '1'},
            postParameters: null,
        },
    },
];

export default tests;
