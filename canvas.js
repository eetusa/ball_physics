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
function randomIntFromRange(min,max){
    return Math.floor(Math.random() * (max - min +1 ) + min);
}

function distance(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

function randomColor(color){
    return colors[Math.floor(Math.random()*colors.length)];
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
                velocityOnCollision(this,balls[i]);
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
    for (let i = 0; i < 2; i++){
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