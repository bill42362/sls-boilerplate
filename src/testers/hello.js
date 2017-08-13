// hello.js
'use strict';

const tests = [
    {
        description: 'should respond query parameters with null post and path parameters.',
        url: 'http://localhost:3000/hello',
        method: 'get',
        queries: {q: '1'},
        body: null,
        expectedResponseStatus: 200,
        expectedResponse: {
            qq: null,
            pathParameters: null,
            queryParameters: {q: '1'},
            postParameters: null,
        },
    },
];

export default tests;
