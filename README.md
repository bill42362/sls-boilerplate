# sls-boilerplate
Serverless boilerplate with express server, auto test and web document.

## Installation
```bash
git clone https://github.com/bill42362/sls-boilerplate.git ${YOUR_PROJECT_NAME}
cd ${YOUR_PROJECT_NAME}
npm install
```

## Scripts
* `npm run deploy` : deploy your apis to aws.
* `npm run start` : run your apis as a **local express server** on *http://localhost:3000*.
* `npm run test` : test your **aws apis** according to */src/testers/\*.js*.
* `npm run devtest` : test your **local express server** according to */src/testers/\*.js*.
* `npm run start:auto` : auto restart version of `npm run start`
* `npm run devtest:auto` : auto restart version of `npm run devtest`

## Write your own serverless apis
* Edit *serverless.yml* to configure your apis, use `dist/handler.XXXX` as handler functions.
* Put your handlers into `/src/handlers`, you can write ES6 codes.
  (See [/src/handlers/hello.js](https://github.com/bill42362/sls-boilerplate/blob/develop/src/handlers/hello.js))
* Export your handlers in */src/handler.js* as usual, also `export default` your handlers to enable testing.
* Use `npm run deploy` to deploy your apis to aws.
* Update your aws api base url in */src/test.config.js* to enable `npm run test`.

## Start local express server
* Use `npm run start` to run it on *http://localhost:3000*.
* Or use `PORT=3030 npm run start` to choose your server port.
* Use `npm run start:auto` to let express server **auto restart** everytime you change files in `/src`.

## Testing
* Write your tester files in `/src/testers` for every "lambda functions" and use the function name as filename.
  (ex: *helloWithInput.js*)
* Export your testers in */src/tester.js*.
* Update your aws api base url in */src/test.config.js* to enable `npm run test`.
* Use `npm run test` to test aws apis.
* Use `npm run devtest` to test local express apis on *http://localhost:3000*.
* Or use `PORT=3030 npm run devtest` to choose your server port.
* Use `npm run devtest:auto` to **auto re-test** everytime you change files in `/src`.
