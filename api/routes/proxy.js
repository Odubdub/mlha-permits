const express = require('express');
const httpProxy = require('http-proxy');
const cors = require('cors');

const app = express();
const proxy = httpProxy.createProxyServer();

const targetServerUrl = 'http://10.0.25.252:3000'; // Change this to the URL of the server you want to forward requests to

app.use(cors({
    origin: '*'
  }));

app.all('*', (req, res) => {
    // Modify the path of the incoming request
    let modifiedPath = req.url;

    //remove the "/forward" from the path
    modifiedPath = modifiedPath.replace('/forward', '');

    // Forward the modified request to the target server
    proxy.web(req, res, { target: targetServerUrl, path: modifiedPath });
});

module.exports = app