// hello.js
'use strict';

export const hello = (event, context, callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello!',
            pathParameters: event.pathParameters,
            queryParameters: event.queryStringParameters,
            postParameters: JSON.parse(event.body),
        }),
    };
    callback(null, response);
};

export default hello;
