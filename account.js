function trim(value) {
  value = value.replace(/\s+/, ""); //왼쪽 공백제거
  value = value.replace(/\s+$/g, ""); //오른쪽 공백제거
  value = value.replace(/\n/g, ""); //행바꿈제거
  value = value.replace(/\r/g, ""); //엔터제거
  return value;
}

exports.postLogin = function(req, res) {
  var id = req.body.id
  var password = req.body.password;
  if (req.session.user) {
    console.log('이미 로그인 되어 있음');
    // res.render('template.html', {
    //   name: req.session.user.name,
    //   start_date: req.session.user.start_date,
    //   end_date: req.session.user.end_date,
    //   address: req.session.user.address,
    //   officer: req.session.user.officer
    // });
    res.redirect('/');
  } else {
    console.log(id);
    conn.execute(`select password, name, address from accounts where user_id='${id}'`, function(err, result) {
      if (err) {
        res.writeHead(404, {
          "ContentType": "text/html"
        });
        res.end("fail!!");
      } else {
        if (result.rows.length > 0) {
          if (password == trim(result.rows[0][0])) {
            req.session.user = {
              id: id,
              pw: password,
              name: result.rows[0][1],
              address: result.rows[0][4],
              authorized: true
            };
            res.redirect('/');
            // res.render('/', {
            //   name: result.rows[0][1],
            //   start_date: result.rows[0][2],
            //   end_date: result.rows[0][3],
            //   address: result.rows[0][4],
            //   officer: result.rows[0][5]
            // });
          } else {
            res.send('<script type="text/javascript">alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요");location.href="/";</script>');
          }
        } else {
          res.send('<script type="text/javascript">alert("존재하지 않는 아이디입니다.");location.href="/";</script>');
          // res.end("fail!!");
        }
        console.log(result.metaData); //테이블 스키마
        console.log(result.rows);
      }
    });
  }
};

exports.getLogout = function(req, res) {
  if (req.session.user) {
    console.log('로그아웃 처리');
    req.session.destroy(
      function(err) {
        if (err) {
          console.log('세션 삭제시 에러');
          return;
        }
        //파일 지정시 제일 앞에 / 를 붙여야 root 즉 public 안에서부터 찾게 된다
        res.redirect('/');
      }
    ); //세션정보 삭제
  } else {
    console.log('로긴 안되어 있음');
    res.redirect('/');
  }
};


exports.getSignup = function(req, res) {
  res.render('sign-up.html');
};

exports.postSignup = function(req, res) {
  var id = req.body.id;
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;
  var address = req.body.address;
  var tel = req.body.tel;
  // 쿼리문 실행
  if (password == password2) {
    conn.execute(`insert into accounts(user_id, name, email, password, address, tel)
                        values('${id}', '${name}', '${email}', '${password}','${address}','${tel}')`,
      function(err, result) {
        if (err) {
          console.log("등록중 에러가 발생했어요!!", err);
          res.writeHead(500, {
            "ContentType": "text/html"
          });
          res.end("fail!!");
        } else {
          res.redirect("/");
        }
      });
  }
  // conn.commit();
  else {
    res.send('<script type="text/javascript">alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요");location.href="/signup";</script>');
  }
};
