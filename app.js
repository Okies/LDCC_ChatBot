
require('./utils/functional');

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var route = require('./modules/route');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(route);

app.listen(3000, () => {
  console.log('Express App on port 3000');
});
