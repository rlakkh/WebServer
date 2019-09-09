module.exports = function(app)
{
    app.get('/',function(req,res){
        var data;
        var length;
        var id, point;
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
            console.log('select connected!!');
            var query = `select userid, point from member order by point desc`;

            var result = connection.query(query, function(err, results, fields) {
                if (err) {
                  console.log(err.message);
                }
                data = JSON.parse(JSON.stringify(results));
                if(results.length>0){
                    length = results.length;
                    data = JSON.parse(JSON.stringify(results));
                    var obj = {
                        len:length,
                        id:req.session.user,
                        data
                    };

                    console.log(obj);
                    res.render('main.ejs',obj);
                }
            });

            connection.end(function(err) {
              if (err) {
                return console.log(err.message);
              }
            });
        });
    });

    app.get('/about',function(req,res){
        var obj = 
        {
            id : req.session.user
        };
        res.render('about.ejs',obj);
    });

    app.get('/service',function(req,res){
        var obj = 
        {
            id : req.session.user
        };
        res.render('service.ejs',obj);
    });
    
    app.get('/community/register',function(req,res){
        var obj = 
        {
            id : req.session.user
        };
        res.render('commuregister.ejs',obj);
    });

    app.post('/community/form',function(req,res){
        var name = req.body.id;
        var title = req.body.title;
        var text = req.body.text;
        var date = Date('yy-mm-dd');
        var hit = 0;
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
            var query = `insert into community set ?`;
            var data={
                text:text,
                title:title,
                nickname:name,
                date:date,
                hit:hit,
            };

            connection.query(query,data, function(err, results, fields) {
                if (err) {                                
                  console.log(err.message);  
                }      
            });
        
            connection.end(function(err) {
              if (err) {
                return console.log(err.message);
              }
            });
        });
        res.redirect('/community');
    });    


    app.get('/games/game1channel',function(req,res){
        var obj = 
        {
            id : req.session.user
        };
        res.render('game1channel.ejs',obj);
    });

    app.get('/games/game1play',function(req,res){
        var obj = 
        {
            id : req.session.user
        };
        res.render('game1play.ejs',obj);
    });
    
    app.get('/games/game2channel',function(req,res){
        var obj = 
        {
            id : req.session.user
        };
        res.render('game2channel.ejs',obj);
    });

    app.get('/games/game2play',function(req,res){
        var room = req.param('room_num')
        var obj = 
        {
            id : req.session.user,
            room_num:room
        };
        res.render('game2play.ejs',obj);
    });
    
    app.get('/games/win',function(req,res){
        var id = req.session.user;
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
            var query = `update member set point=point+100 where userid = ?`;

            var result = connection.query(query,[id], function(err, results, fields) {
                if (err) {                                
                  console.log(err.message);
                }
                res.redirect('/');          
            });
        
            connection.end(function(err) {
              if (err) {
                return console.log(err.message);
              }
            });
        });
    });

    app.get('/login',function(req,res){
        res.render('login.ejs');
    });
}