// test.config.js
'use strict';
import DeepFreeze from 'deep-freeze';

export const LOCAL_BASE_URL = `http://localhost:${process.env.PORT || '3000'}`;
export const AWS_BASE_URL = 'https://489qcrwwfh.execute-api.ap-northeast-2.amazonaws.com/dev';
export const OTHER_BASE_URLS = DeepFreeze(['http://localhost:3000', 'http://localhost:4000']);
export const BASE_URL = 'aws' === process.env.NODE_ENV ? AWS_BASE_URL : LOCAL_BASE_URL;
