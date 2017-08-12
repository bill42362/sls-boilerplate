// handler.js
'use strict';

export const hello = (event, context, callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless v1.0! Your function executed successfully!',
            input: event.pathParameters,
        }),
    };
    callback(null, response);
};
