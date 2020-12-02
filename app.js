const http = require("http");
const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require("oracledb");
var cookieParser = require('cookie-parser');
const request = require('request');
const app = express();
const server = http.createServer(app);
const fs = require("fs");
var moment = require('moment');
// app.use(express.static('html5up-paradigm-shift'));
app.use(express.static('views'));
app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html')

require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({
  extended: false
}));

var router = express.Router();

oracledb.getConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  connectString: process.env.CONNECTSTR //oracle설치할때 지정한 이름(파일명으로 확인가능)
}, function(err, con) {
  if (err) {
    console.log("접속이 실패했습니다.", err);
  }
  conn = con;
});
oracledb.autoCommit = true;

app.get('/', (req, res) => {
  res.render('template.html');
  // res.render('template.html', {
  //   title: '으갸갹',
  //   description: '',
  // });
})

app.use('/', router); //라우트 미들웨어 등록

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
