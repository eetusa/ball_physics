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





function velocityOnCollision2(ball1,ball2){
   // ball1.color ="red";
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

    let X = x2 - x1;
    let Y = y2 - y1;

    let R = ball1.radius + ball2.radius;
  
   let s = (R)/Math.sqrt(Math.pow(X,2)+Math.pow(Y,2));
    let a = X*(s-1);
    let b = Y*(s-1);
   
    //console.log("x: "+a+"//"+X+" .. y:"+b+"//"+Y);
    let colX = ball2.x - X/2;
    let colY = ball2.y - Y/2;
    let movx = a;
    let movy = b;
  

    //console.log("ball1.xb: "+ball1.x+" ball1.yb :"+ball1.y+" ball2.xb: "+ball2.x+" ball2.yb: "+ball2.y+" - "+movx+" "+movy);
    ball1.x=ball1.x - a;
    ball1.y=ball1.y - b;
    

  
    //console.log("ball1.xa: "+ball1.x+" ball1.ya :"+ball1.y+" ball2.xa: "+ball2.x+" ball2.ya: "+ball2.y);
 
    //ball1.x=innerWidth-ball1.radius-1;
    let D = Math.sqrt( ( Math.pow(X,2)+Math.pow(Y,2) ));

    let V1 = new Vector(Vx1,Vy1);
    let V2 = new Vector(Vx2,Vy2);

    let N = new Vector(X,Y);

    let UN = N.scale(1/D);
    let UT = new Vector(-UN.x2,UN.x1);
    //vectors.push(new vector(UT,colX,colY,"red"));
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
    
    ball1.velocity.x = V1a.x1;
    ball1.velocity.y = V1a.x2;

    ball2.velocity.x = V2a.x1;
    ball2.velocity.y = V2a.x2;
/*
    ball1.x += ball1.velocity.x;
    ball1.y += ball1.velocity.y;
    ball2.x += ball2.velocity.x;
    ball2.y += ball2.velocity.y;
   
   
    ball1.x=ball1.x-2*ball1.velocity.x;
    ball1.y=ball1.y-2*ball1.velocity.y;
    ball2.x=ball2.x-2*ball2.velocity.x;
    ball2.y=ball2.y-2*ball2.velocity.y;

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

// Objects

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

function Ball(x, y, radius, color, velocity){
    this.speed = 2;
    this.x = x;
    this.y = y;
    this.mass = radius/100;
    this.radius = radius;
    this.color = color;
    this.cache = [];
    this.velocity = velocity;


    this.update = balls => {
        this.draw();

        for (let i = 0; i < balls.length; i++){
            
            if (this === balls[i]) continue;
            if (distance(this.x,this.y,balls[i].x,balls[i].y)<this.radius+balls[i].radius){
                velocityOnCollision2(this,balls[i]);
            }
        }     
        if (this.x <= this.radius || this.x >= innerWidth-this.radius){
           
           
            if (this.x<=this.radius){this.x=this.radius+1};
            if (this.x>=innerWidth-this.radius){this.x=innerWidth-this.radius-1};
            this.velocity.x = -this.velocity.x;
        }

        if (this.y <= this.radius || this.y >= innerHeight-this.radius){
           
            if (this.y<=this.radius){this.y=this.radius+1};
            if (this.y>=innerHeight-this.radius){this.y=innerHeight-this.radius-1};
            this.velocity.y = -this.velocity.y;
          
        }
        //applyForce(this.velocity,{x:0,y:0.092});
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.speed*this.velocity.y;
    }

    this.draw = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI *  2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath(); 
        c.font = "15px Arial";
        c.fillStyle = "white";
        c.textAlign="center";
        c.textBaseline = "middle";
        c.fillText(`${Math.round(this.x)}, ${Math.round(this.y)}`,this.x,this.y);

    }

    this.toggleVelocity = function(){
        if (this.cache.length==0){
            this.cache.push(this.velocity.x);
            this.cache.push(this.velocity.y);
            this.velocity.x = 0;
            this.velocity.y = 0;
            return;
        }
    
        if (this.cache.length > 0){
          
            this.velocity.x = this.cache[0];
            this.velocity.y = this.cache[1];
            this.cache = [];
            return;
        }
    }
}

// Implementation
let balls;
let vectors;



function init(){
    balls = [];
    vectors = [];
    
    for (let i = 0; i < 5; i++){
        let radius = randomIntFromRange(30,60);
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
        balls.push(new Ball(x,y,radius,color,velocity));
    }
    /*
    balls.push(new Ball(500,800,100,"black",{x:-0.2,y:-0.2}));
    balls.push(new Ball(500,400,100,"black",{x:0.1,y:0.4}));
    */
    

    addEventListener('keyup', function(e){
        if (e.keyCode==32){
            balls.forEach(ball => {
                ball.toggleVelocity();
            });
        }
    });

}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width, canvas.height);
    balls.forEach(ball => {
        ball.update(balls);

    });
    vectors.forEach(vector => {
        vector.update(vectors);
    })
    c.fillStyle="white";
    c.fillText(mouse.x+","+mouse.y, mouse.x, mouse.y);
}

init();
animate();

