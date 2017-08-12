// hello.js
'use strict';

export const hello = (event, context, callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello!',
            pathParameters: event.pathParameters,
        }),
    };
    callback(null, response);
};

export default hello;
