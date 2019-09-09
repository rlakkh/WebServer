module.exports = function(app)
{
    app.get('/community',function(req,res){
        var page = req.param('page');
        var table_no = req.param('table_no');
        var data;
        var comment;
        var length;
        
        var id,text,title,nickname,date,hit;
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
            var commentquery = `select * from comment where ?`;
            var query = `select * from community`;

            connection.query(commentquery,{page:page}, function(err, results, fields) {
                if (err) {                                
                    console.log(err.message);
                }
                if(results.length>0){
                    comment = JSON.parse(JSON.stringify(results));
                }
            });

            var result = connection.query(query, function(err, results, fields) {
                if (err) {                                
                  console.log(err.message);
                }
                
                if(results.length>0){
                    length = results.length;
                    data = JSON.parse(JSON.stringify(results));
                    var obj = {
                        len:length,
                        user:req.session.user,
                        data,
                        comment,
                        page:page,
                        table_no:table_no
                    };
                    
                    console.log(obj);
                    res.render('community.ejs',obj);
                }
            });

            if(page){
                console.log("page open");
                var insert = "update community set hit=hit+1 where id=?";
                connection.query(insert,parseInt(page),function(err,results,fields){
                    if (err) {                                
                        console.log(err.message);
                    }
                });               
            }
        
            connection.end(function(err) {
              if (err) {
                return console.log(err.message);
              }
            });
        });
    });

    app.post('/community/comment',function(req,res){
        var mysql = require('mysql');
        var key = req.body.key;
        var nick = req.body.id;
        var comment = req.body.text;
        var obj = {
            page:key,
            nickname:nick,
            text:comment
        };
        var sendOBJ;
        console.log(obj);

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
            var commentquery = `insert into comment set ?`;            
            var communityquery = `update community set comment=comment+1 where id = ?`;            
            var data=obj;

            connection.query(commentquery,data, function(err, results, fields) {
                if (err) {                                
                  console.log(err.message);  
                }      
            });

            connection.query(communityquery,key, function(err, results, fields) {
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

    app.get('/community/register',function(req,res){
        var obj = 
        {
            id : req.session.user
        };
        res.render('commuregister.ejs',sendOBJ);
    });

    app.post('/community/form',function(req,res){
        var name = req.body.id;
        var title = req.body.title;
        var text = req.body.text;
        var tmp = new Date();
        var date = tmp.toFormat('YYYY-MM-DD');
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
        res.redirect('/community/redirect');
    });    

    app.get('/community/redirect',function(req,res){
        res.redirect('/community');
    });
}