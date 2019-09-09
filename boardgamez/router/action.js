module.exports = function(app)
{
    app.get('/action',function(req,res){
        var data;
        var length;
        var auc_name,fin_date,min_price;
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
            var query = `select * from action`;

            var result = connection.query(query, function(err, results, fields) {
                if (err) {
                  console.log(err.message);
                }
                console.log('action loaded!!');
                if(results.length>0){
                    length = results.length;
                    data = JSON.parse(JSON.stringify(results));
                    var obj = {
                        len:length,
                        user:req.session.user,
                        id:req.session.user,
                        data
                    };

                    console.log(obj);
                    res.render('action.ejs',obj);
                }
            });

            connection.end(function(err) {
              if (err) {
                return console.log(err.message);
              }
            });
        });
    });

    app.get('/action/register',function(req,res){
        var obj =
        {
            id : req.session.user
        };
        res.render('ac_regist.ejs',obj);
    });

    app.post('/auc/regist',function(req,res){
        var auc_name = req.body.auc_name;
        var fin_date = req.body.fin_date;
        var min_price = req.body.min_price;
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
            var query = `insert into action set ?`;
            var data={
                auc_name:auc_name,
                fin_date:fin_date,
                min_price:min_price
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
        res.redirect('/action/redirect');
    });

    app.get('/action/redirect',function(req,res){
        res.redirect('/action');
    });

    app.get('/bidding', function(req,res){
      var num = req.param('num');
      var obj = {
        id:req.session.user,
        num:num
      };
      res.render('bidding.ejs', obj);
    });

    app.post('/bidding/dive',function(req,res){
        var data;
        var id = req.session.user;
        var auc_name = req.body.num;
        var bid = req.body.bid;
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
            var query = `insert into bidding set ?`;
            var data={
                auc_name:auc_name,
                bid:bid,
                id:id
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
        res.redirect('/action/redirect');
    });

    app.get('/action/redirect',function(req,res){
        res.redirect('/action');
    });

}
