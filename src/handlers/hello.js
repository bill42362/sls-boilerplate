// hello.js
'use strict';

export const hello = (event, context, callback) => {
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: 'Hello!',
            pathParameters: event.pathParameters,
            queryParameters: event.queryStringParameters,
            postParameters: JSON.parse(event.body),
            event
        }),
    };
    callback(null, response);
};

export default hello;
