const awsServerlessExpress = require('serverless-http');
const app = require('./server');
const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  return awsServerlessExpress.proxy(server, event, context);
};
