module.exports = function(app){
    app.get('/',function(req,res){
        
    });

    app.get('/sign',function(req,res){
        res.render('sign.ejs');
    });

    app.post('/sign/join', function(req, res) {
        var id = req.body.id;
        var pass = req.body.pass;
        var name = req.body.name;
        var nickname = req.body.nick;
        var hp = req.body.hp1+"-"+req.body.hp2+"-"+req.body.hp3;
        var email = req.body.email1+"@"+req.body.email2;
        
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
        
            var query = `insert into member set ?`;
        
            var data = {userid:id,password:pass,username:name,nickname:nickname,phone:hp,email:email,point:0};

            connection.query(query,data, function(err, results, fields) {
              if (err) {
                  res.end("ERROR : INSERT FAILED!!");
                  console.log(err.message);
              }
            });
        
            connection.end(function(err) {
              if (err) {
                return console.log(err.message);
              }
            });
        });
        res.redirect('/');
    });

    app.get('/update',function(req,res){
        var id = req.session.user;
        var email=req.session.email.split('@');
        var hp=req.session.phone.split('-');
        var email1=email[0];
        var email2=email[1];
        var hp2=hp[1];
        var hp3=hp[2];

        res.render('update.ejs',{
            id:id,                                    
            password:req.session.pass,
            username:req.session.username,                                    
            nickname:req.session.nickname,
            hp2:hp2,
            hp3:hp3,
            email1:email1,
            email2:email2
        });
    });

    app.post('/update/query',function(req,res){
        var id = req.body.id;
        var pass = req.body.pass;
        var name = req.body.name;
        var nickname = req.body.nick;
        var phone = req.body.hp1+'-'+req.body.hp2+'-'+req.body.hp3;
        var email = req.body.email1+'@'+req.body.email2;
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
            var query = `update member set ? where userid = ?`;
            var data={
                password:pass,
                username:name,
                nickname:nickname,
                phone:phone,
                email:email,
            };

            var result = connection.query(query,[data,id], function(err, results, fields) {
                if (err) {                                
                  console.log(err.message);
                }
                req.redirect('/');          
            });
        
            connection.end(function(err) {
              if (err) {
                return console.log(err.message);
              }
            });
        });
    });
}