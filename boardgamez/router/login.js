module.exports = function(app){
    var jsalert = require('js-alert');
    
    app.get('/login',function(req,res){
        res.render('login.ejs');
    });


    app.get('/login/alert',function(req,res){
        res.send('<script type="text/javascript">'
        +'window.alert("등록된 회원이 아니거나 비밀번호가 틀립니다.");'
        +'history.go(-1)</script>');
    });

    app.post('/login/query', function(req, res) {
        var check = 0;
        var userRows;
        var id = req.body.id;
        var pass = req.body.pass;
        var mysql = require('mysql');

        var connection = mysql.createConnection({
            host:'us-cdbr-iron-east-04.cleardb.net',
    user:'b960f0a4614337',
    port: 3306,
    password:'43ea0d84',
    database:'heroku_64054438fbad6b6',
    insecureAuth : true
        });

        connection.connect(function(err) {
            if (err) {
              return console.error('error: ' + err.message);
            }
            console.log('db connected!!');
            var query = `select * from member where userid = ? and password = ?`;

            var result = connection.query(query,[id,pass], function(err, results, fields) {
                if (err) {                                
                  console.log(err.message);
                }
              
                if(results.length>0){
                    check=results.length;
                    userRows = JSON.parse(JSON.stringify(results));
                    console.log(userRows[0]);
                    console.log("id : "+userRows[0].userid);
                    console.log("passwd : "+userRows[0].password);           
                    userRows[0].password='********';
                    req.session.user=userRows[0].userid;
                    req.session.pass=userRows[0].password;
                    req.session.username=userRows[0].username;
                    req.session.nickname=userRows[0].nickname;
                    req.session.phone=userRows[0].phone;
                    req.session.email=userRows[0].email;
                    res.redirect('/');
                }else{
                    res.redirect('/login/alert');
                }             
            });
        
            connection.end(function(err) {
              if (err) {
                return console.log(err.message);
              }
            });
        });
    });

    app.get('/logout', function(req, res) {
        req.session.destroy();
        res.redirect('/');
    });
}