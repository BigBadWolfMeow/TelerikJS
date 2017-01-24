class Vec
{
	constructor(x=0,y=0)
	{
		this.x=x;
		this.y=y;
	}
}

class Rect 
{
	constructor(w, h)
	{
		this.pos = new Vec;
		this.size = new Vec(w,h);
	}
}

class Ball extends Rect
{
	constructor()
	{
		super(10,10);
		this.vel = new Vec;
	}
}

class Player extends Rect
{
	constructor()
	{
		super(20,100);
		this.vel = new Vec;
		this.stats = 0;
		this.pos.x = 5;
		this.pos.y = canvas.height/2 - this.size.y/2;
		this.speed = 600;
	}
}



const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');
const ball = new Ball;
const yavor = new Player;
const aienemy = new Player;
let LastTime;
console.log(ball);
aienemy.pos.x = canvas.width - aienemy.size.x - 5;
ball.pos.x = 100;
ball.pos.y = 70;
ball.size.x = 20;
ball.size.y = 20;
ball.vel.x = 600;
ball.vel.y = 400;



function callback(millis)
{
	if(LastTime)
	{
		update((millis-LastTime)/1000);
	}
	LastTime = millis;
	requestAnimationFrame(callback);
}

function arrow_up_press()
{
		yavor.vel.y = -yavor.speed;
}

function arrow_down_press()
{
	
		yavor.vel.y = yavor.speed;
}

function keyup()
{
	yavor.vel.y = 0;
}

function update(dt)
{
	//console.log(yavor);
	document.onkeydown = function(e) 
	{
		switch (e.keyCode) {
			case 38:
				//up
				arrow_up_press();
				break;
			case 40:
				//down
				arrow_down_press();
				break;
		}
	};
document.onkeyup = function(e) 
{
	keyup();
}
	ball.pos.x += ball.vel.x * dt;
	ball.pos.y += ball.vel.y * dt;
	aienemy.pos.y = ball.pos.y - aienemy.size.y/2 + ball.size.y/2;
	if(yavor.pos.y>0)
	{
		yavor.pos.y += yavor.vel.y * dt;
	}
	else
	{
		yavor.pos.y = 0;
	}
	
	if(yavor.pos.y + yavor.size.y<canvas.height)
	{
		yavor.pos.y += yavor.vel.y * dt;
	}
	else
	{
		yavor.pos.y = canvas.height - yavor.size.y;
	}
	
	if(ball.pos.x<0)
	{
		ball.vel.x = -ball.vel.x;
		ball.pos.x = canvas.width/2 - ball.size.x/2;
	}
	
	if(ball.pos.x>canvas.width - ball.size.x)
	{
		ball.vel.x = -ball.vel.x;
		ball.pos.x = canvas.width/2 - ball.size.x/2;
		yavor.score++;
	}
	
	if(ball.pos.y>canvas.height - ball.size.y)
	{
		ball.vel.y = -Math.floor((Math.random() * 500) + 100);
	}
	if(ball.pos.y<0)
	{
		ball.vel.y = Math.floor((Math.random() * 500) + 100);
	}
	if(ball.pos.x<yavor.size.x+5 && ball.pos.y>yavor.pos.y && ball.pos.y<yavor.pos.y + yavor.size.y)
	{
		ball.vel.x = -ball.vel.x;
	}
	
	if(ball.pos.x>canvas.width - ball.size.x - aienemy.size.x-5 && ball.pos.y>aienemy.pos.y && ball.pos.y<aienemy.pos.y + aienemy.size.y)
	{
		ball.vel.x = -ball.vel.x;
	}
	
	context.fillStyle = '#000';
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	//print the ball
	context.fillStyle = '#fff';
	context.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y);
	
	//print the Player
	context.fillStyle = '#fff';
	context.fillRect(yavor.pos.x, yavor.pos.y, yavor.size.x, yavor.size.y);
	
	//print the Enemy
	context.fillStyle = '#fff';
	context.fillRect(aienemy.pos.x, aienemy.pos.y, aienemy.size.x, aienemy.size.y);


}
callback();
