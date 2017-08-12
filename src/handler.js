// handler.js
'use strict';

export const hello = (event, context, callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello!',
            input: event.pathParameters,
            enviroment: process.env,
        }),
    };
    callback(null, response);
};

export default { hello };
