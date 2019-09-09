window.onload=function()
{
    var canvas = document.getElementById('game1board');
    var context = canvas.getContext('2d');

    context.fillRect(0,0,150,100);
    context.fillText("game1 시작",155,100);
    context.beginPath();
    context.moveTo(170,200); context.lineTo(300,200);

    context.rect(0,0,400,400);
    context.stroke();
    context.closePath();
}