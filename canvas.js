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

function velocityOnCollision3(ball1,ball2){
    let x1 = ball1.velocity.x;
    let y1 = ball1.velocity.y;
    let x2 = ball2.velocity.x;
    let y2 = ball2.velocity.y;
    let mass1 = ball1.mass;
    let mass2 = ball2.mass;
    let distance = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));

    let v1 = new Vector(x1,y1);
    let v2 = new Vector(x2,y2);

    let n = new Vector((x2-x1),(y2-y1));
    let t = n.scale(1/distance);

    let a1 = v1.dot(t);
    let a2 = v2.dot(t);

    let optimizedP = (2.0 * (a1-a2))/(mass1+mass2);

    let temp1 =t.scale(optimizedP*mass2);
    let temp2 =t.scale(optimizedP*mass1);
    temp1.x1=-temp1.x1;
    temp1.x2=-temp2.x2;
    temp2.x1=-temp2.x1;
    temp2.x2=-temp2.x2;

    let v1a = v1.add(temp1);
    let v2a = v2.add(temp2);

    ball1.velocity.x = v1a.x1;
    ball1.velocity.y = v1a.x2;
    
    ball2.velocity.x = v2a.x1;
    ball2.velocity.y = v2a.x2;
}

function velocityOnCollision2(ball1,ball2){
    let x1 = ball1.velocity.x;
    let y1 = ball1.velocity.y;

    let x2 = ball2.velocity.x;
    let y2 = ball2.velocity.y;

    let m1 = ball1.mass;
    let m2 = ball2.mass;

    let X = x2 - x1;
    let Y = y2 - y1;

    let D = Math.sqrt( ( Math.pow(X,2)+Math.pow(Y,2) ));

    let V1 = new Vector(x1,y1);
    let V2 = new Vector(x2,y2);

    let N = new Vector(X,Y);

    let UN = N.scale(1/D);
    let UT = new Vector(-UN.x2,UN.x1);

    // scalar velocitys along N and T for both objects
    let v1Nb = (UN.x1*x1)+(UN.x2*y1);
    let v1Tb = (UT.x1*x1)+(UT.x2*y1);

    let v2Nb = (UN.x1*x2)+(UN.x2*y2);
    let v2Tb = (UT.x1*x2)+(UT.x2*y2);

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

}

function velocityOnCollision(ball1,ball2){
    let x1 = ball1.velocity.x;
    let y1 = ball1.velocity.y;

    let x2 = ball2.velocity.x;
    let y2 = ball2.velocity.y;

    let m1 = ball1.mass;
    let m2 = ball2.mass;

    let X = x2 - x1;
    let Y = y2 - y1;

    let D = Math.sqrt( ( Math.pow(X,2)+Math.pow(Y,2) ));

    let UNbx = X/D;
    let UNby = Y/D;

    let UTbx = -UNby;
    let UTby = UNbx;

    let v1Nb = UNbx*x1 + UNby*y1;
    let v1Tb = UTbx*x1 + UTbx*y1;

    let v2Nb = UNbx*x2 + UNby*y2;
    let v2Tb = UTbx*x2 + UTbx*y2;
   
    let v1Ta = v1Tb;
    let v2Ta = v2Tb;

    let v1Na = (v1Nb*(m1-m2)+2*m2*v2Nb)/(m1+m2);
    let v2Na = (v2Nb*(m2-m1)+2*m1*v1Nb)/(m1+m2);

    let V1Nxa = v1Na*UNbx;
    let V1Nya = v1Na*UNby;

    let V1Txa = v1Ta*UTbx;
    let V1Tya = v1Ta*UTby;

    let V2Nxa = v2Na*UNbx;
    let V2Nya = v2Na*UNby;

    let V2Txa = v2Ta*UTbx;
    let V2Tya = v2Ta*UTby;

    ball1.velocity.x = V1Nxa+V1Txa;
    ball1.velocity.y = V1Nya+V1Tya;

    ball2.velocity.x = V2Nxa+V2Txa;
    ball2.velocity.y = V2Nya+V2Tya;

    ball1.x += ball1.velocity.x;
    ball1.y += ball1.velocity.y;

    ball2.x += ball2.velocity.x;
    ball2.y += ball2.velocity.y;
}



// Objects

function Ball(x, y, radius, color){
    this.speed = 1;
    this.x = x;
    this.y = y;
    this.mass = 1;
    this.radius = radius;
    this.color = color;
    this.velocity ={
        x: this.speed*(Math.random()-0.5),
        y: this.speed*(Math.random()-0.5),
    }

    this.update = balls => {
        this.draw();

        for (let i = 0; i < balls.length; i++){
            
            if (this === balls[i]) continue;
            if (distance(this.x,this.y,balls[i].x,balls[i].y)<this.radius*2){
                velocityOnCollision2(this,balls[i]);
            }
        }     
        if (this.x <= this.radius || this.x >= innerWidth-this.radius){
           
            this.velocity.x = -this.velocity.x;
        }

        if (this.y <= this.radius || this.y >= innerHeight-this.radius){
           
            this.velocity.y = -this.velocity.y;
        }

        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }

    this.draw = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();

    }
}

// Implementation
let balls;

function init(){
    balls = [];
    for (let i = 0; i < 5; i++){
        let radius = 100;
        let x = randomIntFromRange(radius,canvas.width-radius);
        let y = randomIntFromRange(radius,canvas.height-radius);
        if (i !== 0){
            for (let j = 0; j < balls.length; j++){
                if ( distance (x,y,balls[j].x,balls[j].y) <= radius*2 ){

                    x = randomIntFromRange(radius,canvas.width-radius);
                    y = randomIntFromRange(radius,canvas.height-radius);
                    j = -1;
                }
            }
        }
        color = randomColor();
        balls.push(new Ball(x,y,radius,color));
    }
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width, canvas.height);
    c.fillText("p l a c e h o l d e r", mouse.x, mouse.y);
    balls.forEach(ball => {
        ball.update(balls);

    });
}

init();
animate();