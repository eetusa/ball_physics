// Init
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height= innerHeight;

// Variables
let mouse = {
    x: 0,
    y: 0
}

const colors = [
    '#2185C5',
    '#7ECEFD',
    '#FFF6E5',
    '#FF7F66',
];

const colors2 = [
    "red",
    "black",
    "green",
    "orange",
    "gray",
]

// Eventlisteners

addEventListener("mousemove", function(event){
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

addEventListener("resize",function(){
    canvas.width = innerWidth;
    canvas.height= innerHeight;

    init();
});


// Utility functions
function Point(x, y) {
	this.x = x;
	this.y = y;
}
Point.prototype = {
	relative: function(to) {
		return new Vector(to.x - this.x, to.y - this.y);
	},
	distance: function(to) {
		return Math.sqrt(Math.pow(this.x - to.x, 2) + Math.pow(this.y - to.y, 2));
	}
};
function Vector(x1, x2) {
	this.x1 = x1;
	this.x2 = x2;
}
Vector.prototype = {
	add: function(other) {
		return new Vector(this.x1 + other.x1, this.x2 + other.x2);
	},
	scale: function(by) {
		return new Vector(this.x1 * by, this.x2 * by);
	},
	normalize: function() {
		function norm(value) {
			return value > 0 ? 1 : value < 0 ? -1 : 0;
		}
		return new Vector(norm(this.x1), norm(this.x2));
    },
    dot: function(other){
        return (this.x1*other.x1)+(this.x2*other.x2);
    }
};
function randomIntFromRange(min,max){
    return Math.floor(Math.random() * (max - min +1 ) + min);
}

function distance(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

function randomColor(color){
    return colors[Math.floor(Math.random()*colors.length)];
}


function checkRest(balls, value){
    
    for (let i = 0; i < balls.length; i++){
        
    }
    return value+1;
}


function velocityOnCollision2(ball1,ball2){

   ball1.collisionCount++;
  
   /*
    if (Math.abs(ball1.velocity.x)<0.01 && Math.abs(ball1.velocity.y)<0.01){
        ball1.velocity.x = 0;
        ball1.velocity.y = 0;
        return;
    }
*/





   ball1.color ="red";
   //ball2.color = "black";
    let x1 = ball1.x;
    let y1 = ball1.y;

    let x2 = ball2.x;
    let y2 = ball2.y;
    
    let Vx1 = ball1.velocity.x;
    let Vy1 = ball1.velocity.y;

    let Vx2 = ball2.velocity.x;
    let Vy2 = ball2.velocity.y;

    let m1 = ball1.mass;
    let m2 = ball2.mass;

    if (ball1.clicked){
        m1 = 4*m2;
    }
    if (ball2.clicked){
        m2 = 4*m1;
    }

    let X = x2 - x1;
    let Y = y2 - y1;
    let D = Math.sqrt( ( Math.pow(ball2.x-ball1.x,2)+Math.pow(ball2.y-ball1.y,2) ));
    let R = ball1.radius + ball2.radius;
  
   let s = R/D;
  let s1 = ball1.scalarVelocity()/(ball1.scalarVelocity()+ball2.scalarVelocity());
  let s2 = ball2.scalarVelocity()/(ball1.scalarVelocity()+ball2.scalarVelocity());
//  console.log(s1+","+s2);
  let a = X*(s-1);
    let b = Y*(s-1);
   
    let ratio = ball1.radius/ball2.radius;
    let colX = ball1.x + (ball1.radius/R)*X;
    let colY = ball1.y + (ball1.radius/R)*Y;
   // let movx = a*1.0;
   // let movy = b*1.0;

   let e1x = 1+Math.abs(ball1.velocity.x)*0.1
   let e1y = 1+Math.abs(ball1.velocity.y)*0.1
   let e2x = 1+Math.abs(ball2.velocity.x)*0.1
   let e2y = 1+Math.abs(ball2.velocity.y)*0.1

    

  //  console.log("ball1x: "+ball1.x+" ball1y: "+ball1.y+", ball2x: "+ball2.x+" ball2y: "+ball2.y + ", X: "+X+" Y: "+Y+", D: "+D);
   
   
    ball1.x=ball1.x - a*s1*e1x;
    ball1.y=ball1.y - b*s1*e1y;
    ball2.x=ball2.x + a*s2*e2x;
    ball2.y=ball2.y + b*s2*e2y;

    
    //debugger;
   // console.log("x: "+a+"//"+X+" .. y:"+b+"//"+Y+" s: "+ratio);
   // console.log("ball1.xb: "+ball1.x+" ball1.yb :"+ball1.y+" ball2.xb: "+ball2.x+" ball2.yb: "+ball2.y+" - "+movx+" "+movy);
    
 
    //ball1.x=innerWidth-ball1.radius-1;


    let V1 = new Vector(Vx1,Vy1);
    let V2 = new Vector(Vx2,Vy2);

    let N = new Vector(X,Y);

    let UN = N.scale(1/D);
    let UT = new Vector(-UN.x2,UN.x1);
   // vectors.push(new vector(UT,colX,colY,"red"));
   // vectors.push(new vector(UN,colX,colY,"blue"));
    //console.log(x1+" "+x2+" "+colX);

    // scalar velocitys along N and T for both objects
    let v1Nb = (UN.x1*Vx1)+(UN.x2*Vy1);
    let v1Tb = (UT.x1*Vx1)+(UT.x2*Vy1);

    let v2Nb = (UN.x1*Vx2)+(UN.x2*Vy2);
    let v2Tb = (UT.x1*Vx2)+(UT.x2*Vy2);

    let v1Ta = v1Tb;
    let v2Ta = v2Tb;

    // conservation of energy >>
    let v1Na = (v1Nb*(m1-m2)+2*m2*v2Nb)/(m1+m2);
    let v2Na = (v2Nb*(m2-m1)+2*m1*v1Nb)/(m1+m2);

    V1Na = UN.scale(v1Na);
    V1Ta = UT.scale(v1Ta);
 
    V2Na = UN.scale(v2Na);
    V2Ta = UT.scale(v2Ta);

    V1a = V1Na.add(V1Ta);
    V2a = V2Na.add(V2Ta);
    
    let elst = 0.98;

    ball1.velocity.x = elst*V1a.x1;
    ball1.velocity.y = elst*V1a.x2;

    ball2.velocity.x = elst*V2a.x1;
    ball2.velocity.y = elst*V2a.x2;

   // console.log("ball1x: "+ball1.x+" ball1y: "+ball1.y+", ball2x: "+ball2.x+" ball2y: "+ball2.y+", D: "+Math.sqrt( ( Math.pow(ball2.x-ball1.x,2)+Math.pow(ball2.y-ball1.y,2) ))+", ball1vx: "+ball1.velocity.x +" ball1vy: "+ball1.velocity.y+" ball1scalarv: "+ball1.scalarVelocity()+", ball2vx: "+ball2.velocity.x+" ball2vy: "+ball2.velocity.y+" ball2scalarv: "+ball2.scalarVelocity());
   // console.log("1x: "+V1a.x1+" 1y: "+V1a.x2+ " 2x: "+V2a.x1+" 2y: "+V2a.x2);

   //ball1.x=ball1.x - movx;
   //ball1.y=ball1.y - movy;
/*
    if (ball2.x-(ball1.x+ball1.velocity.x) > ball2.x-ball1.x){
    ball1.x += ball1.velocity.x;} else {ball1.x -= ball1.velocity.x;}

    if (ball2.y-(ball1.y+ball1.velocity.y) > ball2.y-ball1.y){
    ball1.y += ball1.velocity.y; console.log("this");} else {ball1.y -= ball1.velocity.y;}

    if (ball2.x+ball2.velocity.x-ball1.x > ball2.x-ball1.x){
    ball2.x += ball2.velocity.x;} else {ball2.x -= ball2.velocity.x;}

    if (ball2.y+ball2.velocity.y-ball1.y > ball2.y-ball1.y){
    ball2.y += ball2.velocity.y; console.log("this");} else {ball2.y -= ball2.velocity.y;}

*/
 // vectors.push(new vector(V1a,colX,colY,"black"));
 // vectors.push(new vector(V2a,colX,colY,"green"));
    //console.log("ball1.xa: "+ball1.x+" ball1.ya :"+ball1.y+" ball2.xa: "+ball2.x+" ball2.ya: "+ball2.y);
/*
    ball1.x += ball1.velocity.x;
    ball1.y += ball1.velocity.y;
    ball2.x += ball2.velocity.x;
    ball2.y += ball2.velocity.y;
   
   
    ball1.x=ball1.x-2*ball1.velocity.x;
    ball1.y=ball1.y-2*ball1.velocity.y;
    ball2.x=ball2.x-2*ball2.velocity.x;
    ball2.y=ball2.y-2*ball2.velocity.y;


   balls.forEach(ball => ball.toggleVelocity);
 
   ball1.velocity.x= 0;
   ball1.velocity.y=0;
   ball2.velocity.x=0;
   ball2.velocity.y=0;
  */
 
}

function applyForce(vec,force){
    vec.x = vec.x + force.x;
    vec.y = vec.y + force.y;
};

function pointInPolygon(P,polygon){

}

// Objects

function Gravity(){
    this.value = {x:0,y:0.092};
    this.gravitates = 1;

    this.changeGravity = function({a,b}){
        this.value = {x:a,y,b}
    }

    this.reverseGravity = function(){
        return {x:-this.value.x,y:-this.value.y};
    }

    this.toggleFreeze = function(){
        if (this.gravitates == 1){this.gravitates = 0; return};
        if (this.gravitates == 0){this.gravitates = 1; return}
    }

    this.defaultGravity = function(){
        this.value = {x:0,y:0.092};
    }
}

function vector(vector, x, y, color){
    this.x = x;
    this.y = y;
    this.vector = vector
    this.color = color;

    this.update = function() {
        this.draw();
    }

    this.draw = function(){
        c.beginPath();
        c.moveTo(this.x,this.y);
        c.lineTo(this.x+100*this.vector.x1,this.y+100*this.vector.x2)
        c.lineWidth=5;
        c.strokeStyle = this.color;
        c.stroke();
        c.closePath();

    }

}

function Rectangle (x, y, width, height, axisXoffset, axisYoffset, rotation, color, velocity, name, gravity){

    this.x = x;
    this.y = y;

    this.rotation = rotation; // radians
    this.angularvelocity = 0.002;
    this.width = width;
    this.height = height;
    this.color = color;
    this.velocity = velocity;
    this.name = name;
    this.gravity = gravity;
    this.diag = Math.sqrt(Math.pow(this.height,2)+Math.pow(this.width,2));
    

    console.log(Math.PI-this.rotation);
    this.vertices = [];
    this.vertices.push(new Vector(this.x,this.y));
    this.vertices.push(new Vector(this.x+Math.cos(Math.PI/2+this.rotation)*this.height, this.y+Math.sin(Math.PI/2+this.rotation)*this.height));
    console.log(this.vertices);
    this.vertices.push(new Vector(this.x+Math.cos(this.rotation)*this.width,this.y+Math.sin(this.rotation)*this.width));
    this.vertices.push(new Vector(this.x+Math.cos(this.rotation)*this.width+Math.cos(Math.PI/2+this.rotation)*this.height,this.y+Math.sin(this.rotation)*this.width+Math.sin(Math.PI/2+this.rotation)*this.height));
    
    if (axisXoffset == "right"){
        this.axisoffsetX = width/2;
        
    } else if (axisXoffset == "left"){
        this.axisoffsetX = -width/2;
       
    } else{
        this.axisoffsetX = axisXoffset;
    }

    if (axisYoffset == "top"){
        this.axisoffsetY = height/2;
    } else if (axisYoffset == "bottom"){
        this.axisoffsetY = -height/2;
    } else{
        this.axisoffsetY = axisYoffset;
    }

    

    this.axisx = this.x+this.width/2+this.axisoffsetX;
    this.axisy = this.y+this.height/2+this.axisoffsetY;
   // this.vertices.push(new Vector(this.axisx,this.axisy));
    //this.vertices.push(new Vector(this.x,this.y));
    this.offsetdiag = Math.sqrt(Math.pow(this.axisx-this.axisoffsetX,2)+Math.pow(this.axisy-this.axisoffsetY,2));
  
    this.corner_off0x = this.width/2-this.axisoffsetX;
    this.corner_off0y = this.height/2-this.axisoffsetY;

 

  console.log (this.x + " "+this.y+ " "+this.axisx+" "+Math.sqrt(Math.pow(this.corner_off0x,2)+Math.pow(this.corner_off0y,2)));

    this.update = rectangles => {

    this.angularvelocity=0.002;
    this.rotation = this.rotation + this.angularvelocity;

    this.tempa1 = (this.axisoffsetX - this.width/2);
    this.tempb1 = (this.axisoffsetY - this.height/2);
    this.tempc1 = Math.PI/2 - this.rotation - Math.tanh(this.tempb1/this.tempa1);

    this.tempa2 = (this.axisoffsetX + this.width/2);
    this.tempb2 = (this.axisoffsetY - this.height/2);
    this.tempc2 = Math.PI/2 - this.rotation - Math.tanh(this.tempb2/this.tempa2);

    this.tempa3 = (this.axisoffsetX + this.width/2);
    this.tempb3 = (this.axisoffsetY + this.height/2);
    this.tempc3 = Math.PI/2 - this.rotation - Math.tanh(this.tempb3/this.tempa3);

    this.tempa4 = (this.axisoffsetX - this.width/2);
    this.tempb4 = (this.axisoffsetY + this.height/2);
    this.tempc4 = Math.PI/2 - this.rotation - Math.tanh(this.tempb4/this.tempa4);

  if (Math.abs(this.axisoffsetX)>this.width/2){
    this.vertices[0].x1 = this.axisx - Math.cos(Math.PI/2-this.tempc1)*Math.sqrt(Math.pow(this.tempa1,2)+Math.pow(this.tempb1,2));
    this.vertices[0].x2 = this.axisy - Math.sin(Math.PI/2-this.tempc1)*Math.sqrt(Math.pow(this.tempa1,2)+Math.pow(this.tempb1,2));
    this.vertices[3].x1 = this.axisx - Math.cos(Math.PI/2-this.tempc4)*Math.sqrt(Math.pow(this.tempa4,2)+Math.pow(this.tempb4,2));
    this.vertices[3].x2 = this.axisy - Math.sin(Math.PI/2-this.tempc4)*Math.sqrt(Math.pow(this.tempa4,2)+Math.pow(this.tempb4,2));
  } else {
    this.vertices[0].x1 = this.axisx - Math.cos(Math.PI/2+this.tempc1)*Math.sqrt(Math.pow(this.tempa1,2)+Math.pow(this.tempb1,2)); // POTENTIAL!!
    this.vertices[0].x2 = this.axisy + Math.sin(Math.PI/2+this.tempc1)*Math.sqrt(Math.pow(this.tempa1,2)+Math.pow(this.tempb1,2));
    this.vertices[3].x1 = this.axisx - Math.cos(Math.PI/2+this.tempc4)*Math.sqrt(Math.pow(this.tempa4,2)+Math.pow(this.tempb4,2));
    this.vertices[3].x2 = this.axisy + Math.sin(Math.PI/2+this.tempc4)*Math.sqrt(Math.pow(this.tempa4,2)+Math.pow(this.tempb4,2));
  }
    this.vertices[1].x1 = this.axisx - Math.cos(Math.PI/2-this.tempc2)*Math.sqrt(Math.pow(this.tempa2,2)+Math.pow(this.tempb2,2));
    this.vertices[1].x2 = this.axisy - Math.sin(Math.PI/2-this.tempc2)*Math.sqrt(Math.pow(this.tempa2,2)+Math.pow(this.tempb2,2));
    this.vertices[2].x1 = this.axisx - Math.cos(Math.PI/2-this.tempc3)*Math.sqrt(Math.pow(this.tempa3,2)+Math.pow(this.tempb3,2));
    this.vertices[2].x2 = this.axisy - Math.sin(Math.PI/2-this.tempc3)*Math.sqrt(Math.pow(this.tempa3,2)+Math.pow(this.tempb3,2));

    

        this.draw();
    }

    this.draw = function(){
        c.beginPath();
        c.translate(this.axisx,this.axisy);
        c.rotate((this.rotation));
        c.fillStyle = this.color;
        c.fillRect(-this.width/2-this.axisoffsetX,-this.height/2-this.axisoffsetY, this.width, this.height); 
      /*
        c.font = "15px Arial";
        c.fillStyle = "black";
        c.textAlign="center";
        c.textBaseline = "middle";
        c.fillText(this.axisoffsetX>this.width/2, 0,0);
        */
        c.rotate(-(this.rotation));
        c.translate(-this.axisx,-this.axisy);
        
        

        for (let i = 0; i < this.vertices.length; i++){
            c.fillStyle = "black";
            if (i==5)c.fillStyle = "white";
            c.fillRect(this.vertices[i].x1, this.vertices[i].x2,5,5);
           // if (i==0)c.fillRect(this.vertices[i].x1, this.vertices[i].x2,10,10);
            
            c.fillStyle = colors2[i];
            if (i==5)c.fillStyle = "white";
            c.fillRect(this.vertices[i].x1+1, this.vertices[i].x2+1,3,3);
        }
       // c.beginPath();
 
       
        
        

        c.closePath();
       

       // c.font = "15px Arial";
       // c.fillStyle = "black";
      //  c.textBaseline = "middle";
       // c.fillText(this.axisx+ " "+this.axisoffsetX,this.x,this.y);
    }
}

function Ball(x, y, radius, color, velocity, name, gravity){
    this.velocity = velocity;
    this.collisionCount = 0;
    this.collidedWith=[];
    this.collisionByRelation=[];
    this.counter = 0;
    this.speed = 5;
    this.x = x;
    this.y = y;
    this.mass = radius*radius;
    this.radius = radius;
    //this.color = color;
    this.cache = [];
    this.name = name;
    this.color = color;
    this.colorM;
    this.gravity = gravity
    this.clicked = 0;
    this.px = x;
    this.py = y;
    this.offsetx = 0;
    this.offsety = 0;
    

  
    
    this.scalarVelocity = function(){
        return Math.sqrt(Math.pow(this.velocity.x,2)+Math.pow(this.velocity.y,2));
    }
    
    this.update = balls => {
        if (this.collisionCount<255){
            this.colorM = this.collisionCount; 
        }
        this.targetColor = "rgb(224, 202, 60)";
        
        this.color = `rgb(255,${255-this.colorM},${255-this.colorM})`;
        this.color = "rgb(45, 48, 71)";

        this.draw();

        if (gravity.gravitates && this.clicked == 0){
        for (let i = 0; i < balls.length; i++){
            
            if (this === balls[i]) continue;
            if (distance(this.x,this.y,balls[i].x,balls[i].y)<this.radius+balls[i].radius){
                
                    velocityOnCollision2(this,balls[i]);
                
            }
        } 
   
        if (this.x <= this.radius || this.x >= innerWidth-this.radius){
           
           
            if (this.x<=this.radius){this.x=this.radius};
            if (this.x>=innerWidth-this.radius){this.x=innerWidth-this.radius};
            this.velocity.x = -this.velocity.x*0.95;
            this.velocity.y = this.velocity.y*0.97;
        }

        if (this.y <= this.radius || this.y >= innerHeight-this.radius){
           
            if (this.y<=this.radius){this.y=this.radius};
            if (this.y>=innerHeight-this.radius){this.y=innerHeight-this.radius};

            this.velocity.y = -this.velocity.y*0.80;
            this.velocity.x = this.velocity.x*0.97;    

            if (Math.abs(this.velocity.y)<0.0244){
                this.velocity.y=0;
                //this.gravity={x:0,y:0.0};
            }   
        }
      
        
          //  if (this.y < innerHeight-this.radius){this.gravity={x:0,y:0.052}};
            applyForce(this.velocity,this.gravity.value);
            this.x = this.x + this.velocity.x;
          this.y = this.y + this.velocity.y;
        
        }

        if (this.clicked == 1){
            this.x = mouse.x+this.offsetx;
            this.y = mouse.y+this.offsety;
            this.velocity.x = this.x-this.px;
            this.velocity.y = this.y-this.py;
            
        } else {
            
        }
        this.mass = this.radius*this.radius;
        this.collidedWith = [];
        this.py = this.y; 
        this.px = this.x;
    }

    this.draw = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI *  2, false); 
        c.fillStyle = this.color;
        c.fill();
        c.closePath(); 
        c.font = "15px Arial";
        c.fillStyle = "black";
        c.textAlign="center";
        c.textBaseline = "middle";
        //c.fillText(`${Math.round(this.x)}, ${Math.round(this.y)}`,this.x,this.y);
        //c.fillText(` ${this.gravity.gravitates}`,this.x,this.y);
    }
}

// Implementation
let balls;
let vectors;
let rectangles;
let gravity;


function init(){
    gravity = new Gravity();

    rectangles = [];
    balls = [];
    vectors = [];

    //rectangles.push(new Rectangle(100,100,100,20,0,0,10,"red",0,"ding",0));
   // rectangles.push(new Rectangle(500,500,260,30,0,0,0,"white",0,"ding",0));
//    rectangles.push(new Rectangle(400,300,300,30,-100,"bottom",0*(Math.PI/180),"rgb(255,100,100)",0,"ding",0));
//     rectangles.push(new Rectangle(600,400,300,30,100,15,0*(Math.PI/180),"rgb(100,100,255)",0,"ding",0));

//     rectangles.push(new Rectangle(800,200,300,30,160,0,0*(Math.PI/180),"rgb(255,255,100)",0,"ding",0));
addEventListener('keyup', function(e){
    if (e.keyCode==66){
        
        for (let i = 0; i < 30; i++){
            let radius = randomIntFromRange(30,50);
            let x = randomIntFromRange(radius,canvas.width-radius);
            let y = randomIntFromRange(radius,canvas.height-radius);
            let velocity = {x: Math.random()-0.5, y: Math.random()-0.5};
            if (i !== 0){
                for (let j = 0; j < balls.length; j++){
                    if ( distance (x,y,balls[j].x,balls[j].y) <= radius+balls[j].radius ){
    
                        x = randomIntFromRange(radius,canvas.width-radius);
                        y = randomIntFromRange(radius,canvas.height-radius);
                        j = -1;
                    }
                }
            }
            color = randomColor();
            balls.push(new Ball(x,y,radius,"white",velocity,i,gravity));
        }
        
    }
});

    addEventListener('keyup', function(e){
        if (e.keyCode==32){
            
                gravity.toggleFreeze();
            
        }
    });

    addEventListener('keyup', function(e){
        if (e.keyCode==69){
            balls.push(new Ball(mouse.x,mouse.y,randomIntFromRange(10,50),"red",{x:0,y:2},1,gravity));
        }
    });

    addEventListener('mousedown',e => {
        
        balls.forEach(ball => {
            
            if (Math.pow(mouse.x-ball.x,2)+Math.pow(mouse.y-ball.y,2) < Math.pow(ball.radius,2)){
               ball.offsetx = ball.x-mouse.x;
               ball.offsety = ball.y-mouse.y;
               console.log(ball.offsetx+" "+ball.x+" "+mouse.x) 
                ball.clicked = 1;
                
            }
    
        });
    });

    addEventListener("mouseup",e => {
       
        balls.forEach(ball => {
            
            ball.clicked = 0;
    
        });
    });

    

}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width, canvas.height);
    //applyForces(balls);
   
    balls.forEach(ball => {
        ball.update(balls);

    });
    
    vectors.forEach(vector => {
        vector.update(vectors);
    })
    rectangles.forEach(rectangle => {
        rectangle.update(rectangles);
    })
    // c.fillStyle="black";
    // c.fillText(mouse.x +" "+ mouse.y, mouse.x, mouse.y);
}


init();
animate();

