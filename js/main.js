'use strict';


var oWidth = document.body.clientWidth;
var oHeight = window.innerHeight;
var box,can1,can2;
var ctx1,ctx2;
var bgPic = new Image();
var outFirePic = new Image();

var fire1 = new Image();
var fire1Width,fire1Height;
var fire2 = new Image();
var fire3 = new Image();

var mouse = {};

var outFire;
var water;
var fires;
var tipsOut,tipsInner;

var gameOver = false;
var gameStart = false;
var goneFire = 0;

var lastTime,deltaTime;

var startBtn = document.getElementById('start-btn');
var startPage = document.getElementById('start-page');
//var tips = document.getElementById('tips');

var countDown = 20;


window.onload = function () {
    init();
    lastTime = Date.now();
    deltaTime = 0;
    bgPic.onload = function () {
        drawBg(ctx2);
    };

    startBtn.onclick = function () {
        startPage.style.display = 'none';
        //tips.style.display = 'block';
        gameStart = true;
        gameLoop();
    };
};
function init() {
    box = document.getElementById('box');
    can1 = document.getElementById('canvas1');
    can2 = document.getElementById('canvas2');

    box.style.width = oWidth + 'px';
    box.style.height = oHeight + 'px';

    can2.width = can1.width = oWidth;
    can2.height =  can1.height = oHeight;

    ctx1 = can1.getContext('2d');
    ctx2 = can2.getContext('2d');

    bgPic.src = './src/bg.png';
    outFirePic.src = './src/outfire.png';
    fire1.src = './src/fire-1.png';

    mouse.x = 100;
    mouse.y = 100;

   /*if(!gameStart) {

       can1.addEventListener('click',clickOutFire,false);
   }*/

        can1.addEventListener('mousemove',onMouseMove,false);
        can1.addEventListener('touchmove',onTouchMove,true);


    fires = new fireObj();
    fires.init();
    outFire = new outFireObj;
    outFire.init();

    water = new waterObj();
    water.init();





}

//主循环
function gameLoop() {
    if(gameStart && gameOver) {
        document.location='closegame?result=小朋友真棒，你成功扑灭了火源！'
    }
    var now = Date.now();
    deltaTime = now - lastTime;
    lastTime = now;
    if(deltaTime > 40) {
        deltaTime = 40;
    }


    ctx1.clearRect(0,0,oWidth,oHeight);
    if(!gameOver) {
        requestAnimationFrame(gameLoop);
        water.update();
        fireGone();
    }
    fires.draw();
    outFire.draw(ctx1);




/*
    ctx1.fillStyle = 'red';
    ctx1.font = '20px verdana';
    ctx1.textAlign = 'center';
    var text = '倒计时：';
    if(countDown<10) {
        text = '倒计时：0'
    }
    ctx1.fillText(text + countDown + '秒',oWidth-100,30);*/

}



//背景
function drawBg(ctx) {
    /*ctx.fillStyle = '#67aabf';
    ctx.fillRect(0,0,oWidth,oHeight);*/
    ctx.drawImage(bgPic,0,0,oWidth,oHeight)
}

//倒计时

function timeout() {
    if(countDown > 0) {
        setTimeout(function () {
            countDown --;
            timeout()
        },1000)
    }else {
        countDown = 0;
    }
}

//火苗类
var fireObj = function () {
   this.fires = [];
   this.angle = 0;
};
fireObj.prototype.num = 5;
fireObj.prototype.init = function () {
  for(var i = 0;i < this.num;i ++) {
      var fire = {
          x:Math.floor(Math.random()*oWidth),
          y:Math.floor(Math.random()*oHeight),
          opacity:1,
          img:fire1,
          //width:fire1.width,
          //height:fire1.height
          width:40,
          height:108,
          amp:Math.random()*10 + 3
      };
      if(fire.x + fire.width > oWidth) {
          fire.x = fire.x - fire.width;
      }
      if(fire.y + fire.height > oHeight) {
          fire.y = fire.y - fire.height;
      }
      this.fires.push(fire);
  }
};
fireObj.prototype.draw = function () {

    this.angle += deltaTime*0.004;
    var l = Math.sin(this.angle);
  for(var i = 0;i < this.fires.length;i ++) {
      ctx1.save();
      ctx1.globalAlpha = this.fires[i].opacity;
      ctx1.drawImage(this.fires[i].img,this.fires[i].x,this.fires[i].y + l*this.fires[i].amp,this.fires[i].width,this.fires[i].height);
      ctx1.restore();
  }
};

//灭火器类
var outFireObj = function (ctx) {
    this.x = 0;
    this.y = 0;
};
outFireObj.prototype.init = function () {
    this.x = 100;
    this.y = 100;
};
outFireObj.prototype.draw = function (ctx) {
    if(gameStart) {
        this.x = lerpDistance(mouse.x,this.x,0.8);
        this.y = lerpDistance(mouse.y,this.y,0.8);

        if(this.x >= oWidth ) {
            this.x = oWidth - 50;
        }
    }

    ctx.drawImage(outFirePic,this.x - outFirePic.width,this.y - outFirePic.height + 30);//管子



    // // tips
    // if(!gameStart && !gameOver) {
    //     ctx.save();
    //     ctx.translate(this.x,this.y);//管子的出口定为原点
    //     ctx.beginPath();
    //     ctx.arc( -30,10,tipsOut.r,0,2*Math.PI);
    //     ctx.closePath();
    //     ctx.strokeStyle = "rgba(75,0,130," + tipsOut.opicty + ")";
    //     ctx.stroke();
    //     ctx.restore();
    //
    //     ctx.save();
    //     ctx.translate(this.x,this.y);//管子的出口定为原点
    //     ctx.beginPath();
    //     ctx.arc( -30,10,tipsInner.r,0,2*Math.PI);
    //     ctx.closePath();
    //     ctx.strokeStyle = "rgba(75,0,130," + tipsInner.opicty + ")";
    //     ctx.stroke();
    //     ctx.restore();
    // }

    //气泡
    ctx.save();
    ctx.lineWidth = 1;
    ctx.shadowBlur = 5;
    ctx.translate(this.x,this.y);//管子的出口定为原点
    if(!gameOver && gameStart) {
       for(var i = 0; i < water.water.length;i ++) {
           ctx.beginPath();
           ctx.arc(water.water[i].x,water.water[i].y,4,0,2*Math.PI);
           ctx.closePath();
           ctx.shadowColor = "rgba(255,255,255," + water.water[i].opacity + ")";
           ctx.strokeStyle = "rgba(255,255,255," + water.water[i].opacity + ")";
           ctx.fillStyle = "rgba(137,220,225," + water.water[i].opacity + ")";
           ctx.fill();
           ctx.stroke();
       }
    }
    ctx.restore();
};

//tips

/*
var tips = function (r) {
    this.x = 0;
    this.y = 0;
    this.opicty = 0;
    this.r = r;
};
tips.prototype.update = function () {
    this.opicty += 0.02;
    if(this.opicty >= 1 ) {
        this.opicty = 0;
    }
};
*/

//泡沫类
var waterObj = function () {
  this.water = [];
};
waterObj.prototype.num = 30;
waterObj.prototype.init = function () {
  for(var i = 0;i < this.num;i ++ ) {
      var water = {
          x :50*Math.random() - 20,
          y :i*Math.random() - 10,
          vx : 0.5,
          vy : -0.5,
          opacity:1
      };
      this.water.push(water);
  }
};
waterObj.prototype.update = function () {
  for(var i = 0;i < this.water.length;i ++) {
      this.water[i].x += this.water[i].vx;
      this.water[i].y += this.water[i].vy;
      this.water[i].opacity -= 0.02;
      if(this.water[i].opacity <= 0 ) { //循环更新
          this.water[i].x = 50*Math.random() + 5;
          this.water[i].y = i*Math.random() - 10;
          this.water[i].opacity = 1;
      }

  }
};

//灭火
function fireGone() {

    if(!gameOver && gameStart) {
        for(var i= 0;i < fires.fires.length; i ++) {
            if(fires.fires[i].opacity >= 0.5) { //火苗透明
                if(fires.fires[i].x - outFire.x <= 20 && fires.fires[i].x - outFire.x > - fires.fires[i].width && fires.fires[i].y < outFire.y && outFire.y < (fires.fires[i].y + fires.fires[i].height))
                {
                    fires.fires[i].opacity -= 0.008;
                    if(fires.fires[i].opacity <= 0.5) {
                        fires.fires[i].width = 0;
                        fires.fires[i].height = 0;
                        goneFire ++;
                    }
                }
            }
        }
    }


    if((goneFire === fires.fires.length)/* || (countDown === 0)*/) {
        gameOver = true;
    }
}

//鼠标事件
function onMouseMove(e) {
    e.preventDefault();
    if(gameStart) {
       getMouseAxis(e);
    }
}
//触屏事件
function onTouchMove(e) {
    e.preventDefault();
    if(gameStart) {
        getTouchAxis(e);
    }

}

//点击灭火器事件
/*function clickOutFire(e) {
    e.preventDefault();
    if(!gameStart) {
        getMouseAxis(e);
        if(mouse.x <= outFire.x && mouse.y >= outFire.y - outFirePic.height && mouse.y <= outFire.y+20) {
            gameStart = true;
        }
    }
}*/

//鼠标或touch坐标
function getMouseAxis(e) {
    e.preventDefault();
    if(e.offsetX || e.layerX) {
        mouse.x = e.offsetX === undefined?e.layerX:e.offsetX;
        mouse.y = e.offsetY === undefined?e.layerY:e.offsetY;
    }
}
function getTouchAxis(e) {
    e.preventDefault();
    var touch = e.touches[0];
    mouse.x = touch.pageX;
    mouse.y = touch.pageY;
}

