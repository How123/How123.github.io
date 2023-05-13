const canvas = document.getElementById('canvas1');
canvas.width = 800;
canvas.height = 800;

const ctx = canvas.getContext('2d');

let count = 0;

const width = 800 ;
const height = 800 ;

const xc = width /2;
const yc = height /2;

const G = 0.5;

const BallAmount = 4;


const maps = [];


function distance1(a,b) {
  if(a>b) return a-b;
  else return b-a;
}

function absolute(a){
  if(a<0) return a*-1;
  return a;  
}

function crossRR(x1,y1,w1,h1, x2,y2,w2,h2) {
  var dx,dy,Dx,Dy;

  dx = absolute(x1-x2);
  dy = absolute(y1-y2);
  Dx = w1 + w2;
  Dy = h1 + h2;

  if (dx < Dx && dy < Dy) return true;
  else return false;

}


function turnRight(a) {
  var dx,dy;
  dx = xc - a.x;
  dy = yc - a.y;

  a.x = xc + dy;
  a.y = yc - dx;


}




function random(min, max) {
  const num = Math.floor(Math.random() * (max - min +1)) + min;
  return num;
}

function randomFloat(min, max) {
  const num = Math.random() * (max - min ) + min;
  return num;
}



function  turnCanvas(angle) {
  ctx.translate(xc, yc);
  ctx.rotate(angle * Math.PI / 180);
  ctx.translate(-1* xc, -1* yc);
}




class Spawn {
  constructor(x,y,vx,vy) {
    this.x = x;
    this.y = y;
    this.velX = vx;
    this.velY = vy;
  }
};



class mapData {
  blocks = [];
  spawns = [];
  plInitial = {};
  
  constructor(wlList,blList,spList,pInitial) {
    if(arguments.length == 0 ) return;

    let that = this;
    wlList.forEach(element => {
      let BL = new Block(element[0], element[1],element[2],element[3]);
      that.blocks.push(BL);       
    });

    blList.forEach(element => {
      let BL = new Block(xc + element[0], yc + element[1],element[2],element[3]);
      that.blocks.push(BL);       
    });

    spList.forEach(element => {
      let spawn = new Spawn(element[0],element[1],element[2],element[3]);
      that.spawns.push(spawn);
    });

    this.plInitial.x = pInitial[0];
    this.plInitial.y = pInitial[1];
  }


  draw() {
    this.blocks.forEach(element => {
      element.draw();
    });
  }

  turnRight() {
    this.blocks.forEach(element => {
      var dx,dy;
      dx = xc - element.x;
      dy = yc - element.y;
      element.x = xc + dy;
      element.y = yc - dx;

      var w,h;
      w = element.h;
      h = element.w;
      element.w = w;
      element.h = h;
    });

    this.spawns.forEach(element => {
      var dx,dy;
      dx = xc - element.x;
      dy = yc - element.y;
      element.x = xc + dy;
      element.y = yc - dx;

      var vx,vy;
      vy = element.velX;
      vx = -1 * element.velY;
      element.velX = vx;
      element.velY = vy;
    });


    

  }


  turnLeft() {
    this.blocks.forEach(element => {
      var dx,dy;
      dx = xc - element.x;
      dy = yc - element.y;
      element.x = xc - dy;
      element.y = yc + dx;

      var w,h;
      w = element.h;
      h = element.w;
      element.w = w;
      element.h = h;
    });

    this.spawns.forEach(element => {
      var dx,dy;
      dx = xc - element.x;
      dy = yc - element.y;
      element.x = xc - dy;
      element.y = yc + dx;

      var vx,vy;
      vy = -1 * element.velX;
      vx = element.velY;
      element.velX = vx;
      element.velY = vy;
    });

    

  }






  copy() {
    let copyMap = new mapData;
    this.blocks.forEach(element => {
      let BL = new Block(element.x, element.y,element.w,element.h);
      copyMap.blocks.push(BL);     
    });

    this.spawns.forEach(element => {
      let SP = new Spawn(element.x, element.y,element.velX,element.velY);
      copyMap.spawns.push(SP);     
    });
    
    copyMap.plInitial.x = this.plInitial.x;
    copyMap.plInitial.y = this.plInitial.y;
    return copyMap;

  }


};


const wlList1 = [
  [xc,0,width/2,10],
  [xc,height,width/2,10],
  [0,yc*1/10,10,height*4/10],
  [0,yc*19/10,10,height*4/10],
  [width,yc*1/10,10,height*4/10],
  [width,yc*19/10,10,height*4/10],
];

const blList1 = [
  [0,0,15,15],
  [-175,-215,50,10],
  [-215,-175,10,50],
  [175,215,50,10],
  [215,175,10,50],
  [-175,215,50,10],
  [-215,175,10,50],
  [175,-215,50,10],
  [215,-175,10,50]
];

const spList1 = [
  [xc,32,0,1],
  [xc,height-32,0,-1]
];

const plInitial1 = [
  xc,
  yc
];


let map1 = new mapData(wlList1,blList1,spList1,plInitial1);


const wlList0 = [
  [xc,0,width/2,10],
  [xc,height,width/2,10],
  [0,yc,10,height/2],
  [width,yc,10,height/2],
];

const blList0 = [
  [0,135,220,10],
  [0,215,220,10],
  [-215,175,10,50],  
  [215,175,10,50]
];

const spList0 = [
  [25,25,0,0]
];

const plInitial2 = [
  xc,
  yc
];


let map0 = new mapData(wlList0,blList0,spList0,plInitial2);




const gameControler = {
  step : 0 ,
  plCommond : {
    w : false ,
    a : false ,
    d : false ,
    stop : false,
    jumpCancel :false
  },

  turnR :false,
  turnL :false,
  turnAngle : 0,

  touchX ,
  touchY ,




  count:0,


  turnGame() {

    if(this.turnR) {
      turnCanvas(1);
      this.turnAngle++;

      PL.draw();
      map.draw();
      balls.forEach(element =>{ 
        element.draw();
      });


      turnCanvas(this.turnAngle * -1);
      if(this.step == 1) {
        ctx.font = "25pt Arial";
        ctx.textAlign = "left";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.fillText("SCORE : " + this.count, 550, 50);
        ctx.strokeText("SCORE : " + this.count, 550, 50);
      }
      if(this.step == 0) {
        let str = "TURN & RUN"
        ctx.textAlign = "center";
        ctx.font = "50pt Arial";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.fillText(str, xc, 250);
        ctx.strokeText(str, xc, 250);
      
        str = "press enter to start"
        ctx.font = "30pt Arial";
        ctx.fillText(str, xc, 320);
        ctx.strokeText(str, xc , 320);
      }
      turnCanvas(this.turnAngle);


      if(this.turnAngle == 90) {
        this.turnR = false;
        this.turnAngle = 0;

        PL.turnRight();
        map.turnRight();
        balls.forEach(element =>{ 
          element.turnRight();
        });

        turnCanvas(-90);


      }


      return true;
    }

    if(this.turnL) {
      turnCanvas(-1);
      this.turnAngle++;

      PL.draw();
      map.draw();
      balls.forEach(element =>{ 
        element.draw();
      });


      turnCanvas(this.turnAngle);
      if(this.step == 1) {
        ctx.font = "25pt Arial";
        ctx.textAlign = "left";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.fillText("SCORE : " + this.count, 550, 50);
        ctx.strokeText("SCORE : " + this.count, 550, 50);
      }
      if(this.step == 0) {
        let str = "TURN & RUN"
        ctx.textAlign = "center";
        ctx.font = "50pt Arial";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.fillText(str, xc, 250);
        ctx.strokeText(str, xc, 250);
      
        str = "press enter to start"
        ctx.font = "30pt Arial";
        ctx.fillText(str, xc, 320);
        ctx.strokeText(str, xc , 320);
      }




      turnCanvas(this.turnAngle * -1);


      if(this.turnAngle == 90) {
        this.turnL = false;
        this.turnAngle = 0;

        PL.turnLeft();
        map.turnLeft();
        balls.forEach(element =>{ 
          element.turnLeft();
        });

        turnCanvas(90);


      }


      return true;
    }

    return false;
  },


  gmControl() {
    if(this.turnGame()) {
      return ;
    }



    switch(this.step) {
      case 0 : {
        this.menuStep();
        this.plCommond.jumpCancel = false;
        this.plCommond.stop = false;
        //if(this.plCommond =='w') this.plCommond='';


        break;
      }
        
      case 1 : {
        this.gammingStep();
        
        this.plCommond.jumpCancel = false;
        this.plCommond.stop = false;
        break;
      }
      case 2 : {
        PL.die();
        this.endStep();
        break;


      }
        

    }
  },

  gameOver() {
    this.step = 2;
    PL.die(true);
  },

  endStep() {
    map.draw();
    balls.forEach(element => {
      element.draw();
    });

    PL.draw();


    let str;
    str = "GAME OVER";
    ctx.font = "50pt Arial";    
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillText(str, xc, yc-50);
    ctx.strokeText(str, xc, yc-50);


  
    //count++;
    ctx.font = "25pt Arial"; 
    str = "SCORE : " + this.count;
    ctx.fillText(str, xc, yc+60);
    ctx.strokeText(str, xc, yc+60);

    ctx.font = "25pt Arial"; 
    str = "press ENTER to restart";
    ctx.fillText(str, xc, yc+110);
    ctx.strokeText(str, xc, yc+110);


  },

  menuStep() {
    map.draw();
    PL.setVel(this.plCommond);
    PL.collisionDetect(map.blocks);
    PL.move();
    PL.draw();

    let str = "TURN & RUN"
    ctx.textAlign = "center";
    ctx.font = "50pt Arial";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillText(str, xc, 250);
    ctx.strokeText(str, xc, 250);
  
    str = "press enter to start"
    ctx.font = "30pt Arial";
    ctx.fillText(str, xc, 320);
    ctx.strokeText(str, xc , 320);
  },

  gammingStep(){
    
    map.draw();
    PL.setVel(this.plCommond);
    PL.collisionDetect(map.blocks);
    PL.move();
    PL.draw();


    if((this.count)%500 == 0) {
      this.creatBall();
    }
    if((this.count-100)%500 == 0) {
      balls[balls.length-1].creating=false;
    }


    for(let i = 0; i < balls.length; i++) {
    
    
      balls[i].collisionBlock(map.blocks);
      balls[i].update();
      balls[i].collisionPL(PL);
      
      
      balls[i].draw();  
    }




    ctx.font = "25pt Arial";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    this.count++;
    ctx.fillText("SCORE : " + this.count, 550, 50);
    ctx.strokeText("SCORE : " + this.count, 550, 50);

  },


  creatBall(){
    const size = 15;
    const vel = 10;
    let i = random(0,map.spawns.length-1);
    //console.log(i);

    let spawn = map.spawns[i];  
    let ball = new Ball(
      spawn.x,
      spawn.y,
      (spawn.velX === 0) ? randomFloat(-0.75,0.75) * vel : spawn.velX * vel *1,
      (spawn.velY === 0) ? randomFloat(-0.75,0.75) * vel : spawn.velY * vel *1,
      "white",
      size
    );
    balls.push(ball);
  },

  gameStart() {
    this.step = 1;
    map = map1.copy();
    PL = new player(map.plInitial.x,map.plInitial.y,'rgb(255,255,255)', 16);
    balls = [];
    this.count = 0;
  },


  keyboardInput() {
    let that = this;
    window.onkeydown = function(e) {
      
        switch(e.key) {
        //move
        case 'w' : {
          that.plCommond.w = true;
          break;        
        }
        case 'a' : {
          that.plCommond.a = true;
          break;        
        }
        case 'd' : {
          that.plCommond.d = true;
          break;        
        }
        //rotate
        case 'q' : {
          if(that.step != 2 && that.turnR == false) {
            that.turnL = true;
          }
          break;
        }
        case 'e' : {
          if(that.step != 2 && that.turnL == false) {
            that.turnR = true;
          }
          break;
        }
         
        //
        case 'Enter' :
          if(that.step != 1) {
            that.gameStart();
          }
          break;
        // default:
        //   break;
      }
    }

    window.onkeyup = function(e) {
      switch(e.key) {
        case 'a' : {
          if(that.plCommond.a)
          {
            that.plCommond.a=false;
            that.plCommond.stop = true;
          }
          //if(that.plCommond == 'a') that.plCommond = 'stop';
          break;
        }
        case 'd' : {
          if(that.plCommond.d)  {
            that.plCommond.d=false;
            that.plCommond.stop = true;
          }
          //if(that.plCommond == 'd') that.plCommond = 'stop';
          break;
        }
        case 'w' : {
          if(that.plCommond.w)  {
            that.plCommond.w = false;
            that.plCommond.jumpCancel=true;
          }
          //if(that.plCommond == 'd') that.plCommond = 'stop';
          break;
        }
      }
    };



  },

  touchInput(){
    
    canvas.addEventListener("touchstart",(e)=>{
      switch(gameControler.step) {
        case 0 :{
          gameControler.gameStart();
          break;
        }
        case 1 :{
          let x = e.touches[0].clientX;
          let y = e.touches[0].clientY;
          gameControler.touchX = x;
          gameControler.touchY = y;


          break;
        }
        case 2 :{
          gameControler.gameStart();
          break;
        }
      }
      
      
    });



    canvas.addEventListener("touchmove",(e)=>{
      alert("hellow");
      switch(gameControler.step) {
        case 1 :{
          let x = e.touches[0].clientX;
          let y = e.touches[0].clientY;

          if(x > gameControler.touchX) {
            gameControler.plCommond.d = true;
          }

          break;
        }
      }
      
      
    });





  }

};




















class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.creating = true;
  }
  
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  };


  update() {
    if(this.creating) return;
    this.x += this.velX;
    this.y += this.velY;  
    
    this.velY += G; 
    
  };


  collisionDetect() {
    for(let j = 0; j < balls.length; j++) {
      if(!(this === balls[j])) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
        }
      }
    }
  };


  collisionPL(PL) {
    if(this.creating) return;

    const dx = this.x - PL.x;
    const dy = this.y - PL.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    if (distance < this.size + PL.w) {
      gameControler.gameOver();
      //PL.color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
    }
      
  };



  collisionDetect2(blocks) {
    var px,py;
    var pd;
    
    for(let i = 0; i < blocks.length; i++) { 
      if (this.x < blocks[i].x - blocks[i].w) { px = blocks[i].x - blocks[i].w;    }
      else if (this.x > blocks[i].x + blocks[i].w) { px = blocks[i].x + blocks[i].w;    }
      else { px = this.x;    }
  
      if (this.y < blocks[i].y - blocks[i].h) { py = blocks[i].y - blocks[i].h;    }
      else if (this.y > blocks[i].y + blocks[i].h)  { py = blocks[i].y + blocks[i].h;    }
      else { py = this.y;    }
  
      pd = (this.x - px) * (this.x - px) + (this.y - py) * (this.y - py);
      
      if (pd < this.size * this.size) {
        this.velX = -1 * this.velX;
        this.velY = -1 * this.velY;
  
  
        this.color = 'rgb(122,122,122)';
      }
      
    }
  };



  collisionBlock(blocks) {
    var px,py;
    var tx,ty;
    var pd;
  
    //this.velY += G; 
  
  
  
    for(let i = 0; i < blocks.length; i++) { 
      tx = this.x + this.velX;
      ty = this.y + this.velY;
  
  
  
      if (tx < blocks[i].x - blocks[i].w) { px = blocks[i].x - blocks[i].w;    }
      else if (tx > blocks[i].x + blocks[i].w) { px = blocks[i].x + blocks[i].w;    }
      else { px = tx;    }
  
      if (this.y < blocks[i].y - blocks[i].h) { py = blocks[i].y - blocks[i].h;    }
      else if (this.y > blocks[i].y + blocks[i].h)  { py = blocks[i].y + blocks[i].h;    }
      else { py = this.y;    }
  
      pd = (tx - px) * (tx - px) + (this.y - py) * (this.y - py);
      
      if (pd < this.size * this.size) {
        this.velX = -1 * this.velX;
  
      }
  
  
  
  
  
      if (this.x < blocks[i].x - blocks[i].w) { px = blocks[i].x - blocks[i].w;    }
      else if (this.x > blocks[i].x + blocks[i].w) { px = blocks[i].x + blocks[i].w;    }
      else { px = this.x;    }
  
      if (ty < blocks[i].y - blocks[i].h) { py = blocks[i].y - blocks[i].h;    }
      else if (ty > blocks[i].y + blocks[i].h)  { py = blocks[i].y + blocks[i].h;    }
      else { py = ty;    }
  
      pd = (this.x - px) * (this.x - px) + (ty - py) * (ty - py);
  
      if (pd < this.size * this.size) {
        this.velY = -0.99 * this.velY;
  
  
      }
  
  
  
  
      
    }
  };



  turnRight() {
    var dx,dy;
    dx = xc - this.x;
    dy = yc - this.y;
    this.x = xc + dy;
    this.y = yc - dx;

    var vx,vy;
    vy = this.velX;
    vx = -1 * this.velY;
    this.velX = vx;
    this.velY = vy;
 

  }

  turnLeft() {
    var dx,dy;
    dx = xc - this.x;
    dy = yc - this.y;
    this.x = xc - dy;
    this.y = yc + dx;

    var vx,vy;
    vy = -1 * this.velX;
    vx =  this.velY;
    this.velX = vx;
    this.velY = vy;
 

  }
  
  
  
  






}






















function Block(x,y,w,h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.color = 'rgb(122,122,122)';
}


Block.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  var ox = this.x - this.w;
  var oy = this.y - this.h;

  ctx.fillRect(ox,oy,this.w * 2,this.h*2);

};





class player {
  constructor(x, y, color, size) {
    this.x = x;
    this.y = y;
    this.velX = 0;
    this.velY = 0;
    this.color = color;
    this.w = size;
    this.h = size;
    this.frame = 0;
    this.q = 0;
    this.jummping = 0;
    this.dead = false;
  }

  setVel(cmd) {
    if(cmd.w) {
      if(this.jummping <2) {
        this.velY = -12;
        this.jummping++;
      }
      
    }
    if(cmd.a) this.velX = -10;
    if(cmd.d) this.velX = 10;
    if(cmd.stop) this.velX = 0;

    }

  

  
  move() {
    
    this.x = this.x + this.velX;
    this.y = this.y + this.velY;

   
    if(this.velY < 30 ) this.velY += G;    
    if(this.y > height) gameControler.gameOver();
  }

  draw() {
    this.frame++;
    let floatPixel;

    if(this.dead == false) {
      if((this.frame%120) >= 60) {
        floatPixel = (this.frame%60)/30;
      }
      else {
        floatPixel = 2 - (this.frame%60)/30;
      }
      
  
  
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x - this.w,this.y - this.h - floatPixel,this.w*2,this.h*2 + floatPixel) ;  
  
      ctx.fillStyle = 'black';
      ctx.fillRect(this.x - this.w/4,this.y - this.h/2 -floatPixel,4,8);  
      ctx.fillRect(this.x + this.w/4,this.y - this.h/2 - floatPixel,4,8);



    }

    else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x - this.w,this.y - this.h ,this.w*2,this.h*2) ;  
  
      ctx.fillStyle = 'black';
      ctx.font = "10pt Arial";
      //count++;
      ctx.fillText("X", this.x+5, this.y);
      ctx.fillText("X", this.x-5, this.y);


    }

  }


  collisionDetect(blocks) {
    var x,y,w,h;
    var bx,by,bw,bh;
    var x2,y2;
  
    x = this.x;
    y = this.y;
    w = this.w;
    h = this.h;
  
    for(let i = 0; i < blocks.length; i++) { 
      bx = blocks[i].x;
      by = blocks[i].y;
      bw = blocks[i].w;
      bh = blocks[i].h;
  
      if (crossRR(x + this.velX ,y  + this.velY ,w,h,bx,by,bw,bh)) {
        x2 = x;
        y2 = y;
  
  
        
        if(crossRR(x,y + this.velY,w,h ,bx,by,bw,bh)) {
          if(y > by) y2 = by + bh + h;
          else y2 = by - bh - h;

          if(this.velY >= 0) this.jummping = 0;
          this.velY = 0;
  
        }
        else if(crossRR(x + this.velX,y,w,h,bx,by,bw,bh)) {
          if(x > bx) x2 = bx + bw + w;
          else x2 = bx - bw - w;
  
          this.velX = 0;
        }
  
  
        else{
          if(x > bx) x2 = bx + bw + w;
          else x2 = bx - bw - w;
          if(y > by) y2 = by + bh + h;
          else y2 = by - bh - h;
  
          this.velX = 0;
          this.velY = 0;
  
        }
  
  
        this.x = x2;
        this.y = y2;
  
  
      }
  
  
  
  
    }
  }

  die(initial) {
    if(initial) {
      this.dead = true;
      this.frame = 0;
      this.velY = -10;

      return;
    }
    
    
    this.y = this.y + this.velY;
    if(this.velY < 30 ) this.velY += G; 




    // console.log(fm)
    // let floatPixel;
    // if(fm <200) floatPixel = -1 * fm;
    // else floatPixel = fm -200;

    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.x - this.w,this.y - this.h + floatPixel,this.w*2,this.h*2 ) ;
    // fm++;
    // if(fm<1200) this.die(fm);

  }
  

  turnRight() {
    var dx,dy;
    dx = xc - this.x;
    dy = yc - this.y;
    this.x = xc + dy;
    this.y = yc - dx;

    var vx,vy;
    vy = this.velX;
    vx = -1 * this.velY;
    this.velX = 0;
    this.velY = vy;

  }

  turnLeft() {
    var dx,dy;
    dx = xc - this.x;
    dy = yc - this.y;
    this.x = xc - dy;
    this.y = yc + dx;

    var vx,vy;
    vy = -1 * this.velX;
    vx = this.velY;
    this.velX = 0;
    this.velY = vy;

  }


}







/*
player.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};
*/







let map = map0.copy();
let balls = [];
let PL = new player(
  xc,yc-25,
  'rgb(255,255,255)',
  16
  );






function loop() {

  ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.fillRect(0,0,width,height);
  

  gameControler.gmControl();
 

  
  requestAnimationFrame(loop);
}




function menuStep() {
  map1.draw();

  
  // for(let i = 0; i < blocks.length; i++) {
  //   blocks[i].draw();
  // }
  
  PL.setVel(gameControler.plCommond);
  PL.collisionDetect(map1.blocks);
  
  PL.move();
  PL.draw();


  let str = "TURN & RUN"
  ctx.font = "50pt Arial";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.fillText(str, 110, 200);
  ctx.strokeText(str, 110, 200);

  str = "press enter to start"
  ctx.font = "30pt Arial";
  ctx.fillText(str, 150, 300);
  ctx.strokeText(str, 150, 300);

}








function gameStep() {
  for(let i = 0; i < blocks.length; i++) {
    blocks[i].draw();
  }





  for(let i = 0; i < balls.length; i++) {
    
    
    balls[i].collisionBlock(blocks);
    balls[i].update();
    balls[i].collisionPL(PL);
    
    
    balls[i].draw();

  }

  PL.setVel(gameControler.plCommond);
  PL.collisionDetect(blocks);
  
  PL.move();
  PL.draw();



  ctx.font = "25pt Arial";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  count++;
  ctx.fillText("SCORE : " + count, 400, 50);
  ctx.strokeText("SCORE : " + count, 400, 50);
}



function endStep() {
  for(let i = 0; i < blocks.length; i++) {
    blocks[i].draw();
  }

  for(let i = 0; i < balls.length; i++) {    
    balls[i].draw();
  }

  PL.draw();



  ctx.font = "25pt Arial";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  //count++;
  ctx.fillText("SCORE : " + count, 400, 50);
  ctx.strokeText("SCORE : " + count, 400, 50);
}








gameControler.touchInput();
gameControler.keyboardInput();
loop();

