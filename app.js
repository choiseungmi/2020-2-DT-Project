const http = require("http");
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const server = http.createServer(app);
const fs = require("fs");
var moment = require('moment');
app.use(express.static('views'));
app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html')

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({
  extended: false
})); //post에서bodyparser로 받기 위함

var router = express.Router();


app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});

app.get('/', (req, res) => {
  res.render('index.ejs', {
    message: ''
  });
})


app.use('/', router); //라우트 미들웨어 등록


app.all('*',
  function(req, res) {
    res.status(404).redirect('statepage/404.html');
  }
);

function trim(value) {
  value = value.replace(/\s+/, ""); //왼쪽 공백제거
  value = value.replace(/\s+$/g, ""); //오른쪽 공백제거
  value = value.replace(/\n/g, ""); //행바꿈제거
  value = value.replace(/\r/g, ""); //엔터제거
  return value;
}
app.set('port', (process.env.HOST || 5000));

app.listen(app.get('port'), () => {
  console.log('running on port', app.get('port'));
})
