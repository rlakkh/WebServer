var host = 'localhost'; 
var port = process.env.PORT||5000;
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
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
 
  let createMember = `create table if not exists member(
                          userid char(12) primary key not null,
                          password char(12) not null,
                          username char(12) not null,
                          nickname char(12),
                          phone char(15),
                          email char(40),
                          point int
                      )`;
  let createComment = `create table if not exists comment(
                          id int NOT NULL AUTO_INCREMENT,
                          page int not null,
                          nickname char(12) NOT NULL,
                          text varchar(1000) NOT NULL,
                          primary key(id)
                      )`;

  let createCommunity = `create table if not exists community(
                          id int NOT NULL AUTO_INCREMENT,
                          text varchar(1000),
                          title char(100) not null,
                          nickname char(20) not null,
                          date char(60) not null,
                          hit int not null,
                          comment int not null default '0',
                          primary key(id)
                      )`;                    
 
  connection.query(createMember, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

  connection.query(createComment, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

  connection.query(createCommunity, function(err, results, fields) {
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

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret:'secret',
saveUninitialized: true,
resave:true,
}));
  
app.use('/public', express.static(path.join(__dirname,'/public')));

app.set('views',__dirname+'/views');
app.set('view engine','ejs');

var mainrouter = require('./router/main')(app);
var loginrouter = require('./router/login')(app);
var signrouter = require('./router/sign')(app);
var communityrouter = require('./router/community')(app);
var actionrouter = require('./router/action')(app);

var player;
var player_turn=1;
var count=1;
var roomcheck=1;
var socket_room= {};
var fulroom = new Array();
var person_num = new Array(10000);
for (i=0;i<10000;i++){
    person_num[i]=0;
}
io.on('connection', function(socket){
    
      socket.on('checkroom',function(room_num){
      if(fulroom[room_num]==1){
          roomcheck=1;//꽉참
      }
      else{
          roomcheck=0;
      }
      socket.emit('checkcomplete',roomcheck,room_num);
  });
  
    socket.on('joinRoom', function(room_num){
    socket_room[socket.id]=room_num;
    socket.join(room_num);
    person_num[room_num]++;//사람수
    player = person_num[room_num];
    if(person_num[room_num]>=2){
        fulroom[room_num]=1;//방이 꽉참
        var startgame=1;
        io.to(room_num).emit('startgame',startgame);
    };
   socket.emit('player_num',player); console.log(JSON.parse(JSON.stringify(io.sockets.adapter.rooms)));
  });
    
    

  console.log('user connected: ', socket.id);
  var name = "user" + count++;
    
  io.to(socket.id).emit('change name',name);

  socket.on('disconnect', function(data){
    var key= socket_room[socket.id];
    person_num[key]=0;
    fulroom[key]=0;
    io.to(key).emit('disconnect');
  });

  socket.on('send message', function(name,text,room_num){
    var msg = name + ' : ' + text;
    console.log(msg);
    io.to(room_num).emit('receive message', msg);
  });

    socket.on('send message_main', function(name,text){
    var msg = name + ' : ' + text;
    console.log(msg);
    io.sockets.emit('receive message_main', msg);
  });    

  socket.on('send gamedata', function(board,room_num,turn){
    console.log(board);
      var myturn=1;
      var yourturn=2;
      if(turn==1){
        io.to(socket.id).emit('receive gamedata',board,yourturn); 
        socket.broadcast.to(room_num).emit('receive gamedata', board,myturn);
      }
      else{
          io.to(socket.id).emit('receive gamedata',board,myturn); 
          socket.broadcast.to(room_num).emit('receive gamedata', board,yourturn);  
      }
  });
});

app.all('*',function(req,res,next){
  res.writeHead(200, {
      "Content-Type":"text/html;charset=utf-8"
  });
  res.end("안녕하세요");
  next();
});

server.listen(port,function(){
  console.log("Listening on "+port);
});