// test.config.js
'use strict';

const LOCAL_BASE_URL = `http://localhost:${process.env.PORT || '3000'}`;
const AWS_BASE_URL = 'https://h15xzbmjfh.execute-api.ap-northeast-2.amazonaws.com/dev';
export const BASE_URL = 'aws' === process.env.NODE_ENV ? AWS_BASE_URL : LOCAL_BASE_URL;
