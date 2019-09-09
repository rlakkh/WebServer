//0 black//1 white//2 red//3 blue
var isWhite;
var turn;
var gameboard;
var player;//1 red//2 blue
var winnercheck;
var isfirst=0;
var size=33;
var socket = io();
var start = 0;
function chatSocket(socket)
{
    socket.on('connect', function () {
    socket.emit('checkroom',room_num);
    socket.on('checkcomplete', function(roomcheck,room_num){

        if(roomcheck==0){
            socket.emit('joinRoom',room_num);
         $('#room').val(room_num);
       }
        else{
            alert("방이 다 찼습니다.");
            history.go(-1);
        }
    });

    socket.on('startgame',function(startgame){
        start=startgame;
        alert("게임 시작합니다.")
    });
        socket.on('player_num',function(play){
            player=play;
            if(isfirst==0){
                isfirst++;
                winnercheck=player;
            }
            turn=play;
        })
    });
    
    var playername;
    $('#chat').on('submit', function(e){
        socket.emit('send message', $('#name').val(), $('#message').val(),room_num);
        $('#message').val("");
        $("#message").focus();
        e.preventDefault();
    });
    socket.on('receive message', function(msg){
        $('#chatLog').append(msg+"\n");
        $('#chatLog').scrollTop($('#chatLog')[0].scrollHeight);
    });
    
    socket.on('change name', function(name){
        playername=name;
        $('#name').val(name);
    });

    
    $('#SquareLanding').on('mouseup',function(evt){
        if(isWhite){
            if(turn==1&start==1){
                socket.emit('send gamedata',board,room_num,turn);
            }
        }
    });
    
    socket.on('receive gamedata',function(board,player_turn){
        var iswinner=false;
        gameboard=board;
        display(gameboard);
        win = gameWinCheck(gameboard);
        if(win=="red"){
            if(winnercheck==1){
                iswinner=true;
                alert("You Win!!");
            }
            else{
                iswinner=false;
                alert("You Lose!!");
            }                
            location.href="/games/win";
        }
        if(win=="blue"){
            if(winnercheck==2){
                iswinner=true;
                alert("You Win!!");
            }
            else{
                iswinner=false;
                alert("You Lose!!");
            }
            location.href="/games/win";
        }
        turn=player_turn;
    });

    
    socket.on('disconnect',function(){
        alert("상대방이 나갔습니다.");
        history.go(-1);
    });
}

function init(){
    var board = new Array(15);

    for(var i=0;i<15;i++){
        board[i]=new Array(15);
    }

    for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){            
            var x = i-7;
            var y = 7-j;
            if((y<=x+7)&&(y>=x-7)&&(y<=-x+7)&&(y>=-x-7)){
                board[i][j]=1;
            }else{
                board[i][j]=0;
            }
        }
    }
    return board;
}

function display(board)
{
    this.board=board;
    var canvas = document.getElementById("SquareLanding");
    var context = canvas.getContext("2d");
    context.strokeStyle = "#AAAAAA";
    for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){
            if(board[i][j]==0){
                context.fillStyle = "#000000";
            }
            if(board[i][j]==1){
                context.fillStyle = "#FFFFFF";
            }
            if(board[i][j]==2){
                context.fillStyle = "#FF0000";
            }
            if(board[i][j]==3){
                context.fillStyle = "#0000FF";
            }
            context.fillRect(i*size,j*size,size,size);
            context.strokeRect(i*size,j*size,size,size);
        }
    }
}

function isInBoard(row,col)
{
    if((row>=0)&&(row<=14)&&(col>=0)&&(col<=14)){
        return true;
    }else{
        return false;
    }
}

function isSetCenterBlack(board,x,y)
{
    var countwhite=0;
    var centerx=Math.floor(x/size);
    var centery=Math.floor(y/size);
    for(var i=-1;i<=1;i++){
        for(var j=-1;j<=1;j++){
            if(isInBoard(centerx+i,centery+j)){
                if(board[centerx+i][centery+j]==1){
                    countwhite++;
                }
            }
        }
    }
    if (countwhite==9) {
        return true;
    } else {
        return false;
    }
}


function setBoardFromXY(board,x,y,setCenterBlack)
{
    var row,col;
    col = Math.floor(y/size);
    row = Math.floor(x/size);
    isWhite=false;
    if(board[row][col]==1){
        isWhite=true;
        for(var i=-1;i<=1;i++){
            for(var j=-1;j<=1;j++){
                if(isInBoard(row+i,col+j)){
                    switch(board[row+i][col+j]){
                        case 1:
                            board[row+i][col+j]=player+1;
                        break;
                        case 2:
                        if(player==1){
                            board[row+i][col+j]=player+1;
                        }
                        else{
                            board[row+i][col+j]=0;
                        }
                        break;
                        case 3:
                        if(player==2){
                            board[row+i][col+j]=player+1;
                        }
                        else{
                            board[row+i][col+j]=0;
                        }
                        break;
                    }
                }
            }
        }
        if(setCenterBlack){
            board[row][col] = 0;
        }
    }
    
    return board;
}

function gameWinCheck(board)
{
    var white = 0,red = 0,blue = 0;//1,2,3
    for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){
            switch(board[i][j]){
                case 1:
                white++;
                break;
                case 2:
                red++;
                break;
                case 3:
                blue++;
                break;
            }
        }
    }
    if(white!=0){
        return "play";
    }else{
        if (red>blue) {
            return "red";
        } else {
            return "blue";
        }
    }
}

window.onload = function()
{
    var first = true;
    var canvas = document.getElementById('SquareLanding');
    var context = canvas.getContext('2d');
    var win;
    gameboard = init();
    display(gameboard);

    canvas.addEventListener('mouseup',function(evt){
        this.boardX = Math.floor(evt.pageX-canvas.offsetLeft);
        this.boardY = Math.floor(evt.pageY-canvas.offsetTop);
    });
    canvas.addEventListener('mousemove',function(evt){
        var x = evt.pageX-canvas.offsetLeft;
        var y = evt.pageY-canvas.offsetTop;
        var tmp =  JSON.parse(JSON.stringify(gameboard));
        var check = isSetCenterBlack(tmp,x,y);
        var temp = setBoardFromXY(tmp,x,y,check);      
        display(temp);
    });   
    
}

function getQuerystring(paramName)
{
    var _tempUrl = window.location.search.substring(1); //url에서 처음부터 '?'까지 삭제 
    var _tempArray = _tempUrl.split('&'); // '&'을 기준으로 분리하기 
    for(var i = 0; _tempArray.length; i++) { 
        var _keyValuePair = _tempArray[i].split('='); // '=' 을 기준으로 분리하기 
        if(_keyValuePair[0] == paramName){ // _keyValuePair[0] : 파라미터 명 // _keyValuePair[1] : 파라미터 값 
            return _keyValuePair[1]; 
        }
    }
} 

var room_num=(getQuerystring('room_num'));

chatSocket(socket);