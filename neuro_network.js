const canvas = document.getElementById('field');
const context = canvas.getContext('2d');
let LastTime = 0.1;
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

class Bullet extends Rect
{
	constructor(oriantation)
	{
		super(10,3);
		this.oriantation = oriantation;
	}
}



class Synapse 
{
	constructor(weight)
	{
		this.weight = weight;
	}
}

class Neuron 
{
	constructor(value)
	{
		this.value = value;
	}
}

class Creature
{
	constructor(isitrandom,parent1,parent2)
	{
		this.synapses = [36];
		this.neurons = [13];
		this.bullets = [];
		this.bullet_count = 0;
		this.pos = new Vec;
		this.size = 30;
		for(var i = 0;i<13;i++)
			{
				this.neurons[i] = Math.random();
			}
		this.neurons[11] = Math.random();
		this.neurons[10] = Math.random();
		this.neurons[12] = Math.random()*360;
		this.pos.x = Math.floor(Math.random()*canvas.width);
		this.pos.y = Math.floor(Math.random()*canvas.height);
		if(isitrandom)
		{
			for(var i = 0;i<36;i++)
			{
				var random = Math.random();
				if(Math.random()<0.5)
				{
					random = -random;
				}
				this.synapses[i] = random;
			}
		}
		else
		{
			for(var i = 0;i<36;i++)
			{
				if(Math.random()<0.5)
				{
					this.synapses[i] = population[parent1].synapses[i];
				}
				else
				{
					this.synapses[i] = population[parent2].synapses[i];
				}
			}
		}
		
		
	}
}



population = [];
population.size = 0;
create_population (20);
var frames = 0;
const animation_speed = 1;
console.log(population);
function create_population (size)
{
	for(i=0;i<size;i++)
	{
		population[population.size] = new Creature(true,0,0);
		population.size++;
	}
}



function callback(millis)
{
	if(LastTime)
	{
		update((millis-LastTime)/1000);
	}
	LastTime = millis;
	requestAnimationFrame(callback);
}

function intpoint_inside_trigon(sx,sy,ax,ay,bx,by,cx,cy)
{
    var as_x = sx-ax;
    var as_y = sy-ay;

    var s_ab = (bx-ax)*as_y-(by-ay)*as_x > 0;

    if((cx-ax)*as_y-(cy-ay)*as_x > 0 == s_ab) return false;

    if((cx-bx)*(sy-by)-(cy-by)*(sx-bx) > 0 != s_ab) return false;

    return true;
}

function update(dt)
{
	
	console.log(population);
	frames++;
	context.fillStyle = '#ccffff';
	context.fillRect(0, 0, canvas.width, canvas.height);
	for(var i = 0;i<population.size;i++)
	{
		for(z=0;z<6;z++)
		{
			population[i].neurons[z] = 0;
		}
		var s = new Vec;
		var a = new Vec;
		var b = new Vec;
		var c = new Vec;
		var d = new Vec;
		a.x = population[i].pos.x;
		a.y = population[i].pos.y;
		
		b.x = population[i].pos.x + 370* Math.cos((population[i].neurons[12]+30) * Math.PI / 180);
		b.y = population[i].pos.y + 370* Math.sin((population[i].neurons[12]+30) * Math.PI / 180);
		
		d.x = population[i].pos.x + 370* Math.cos((population[i].neurons[12]) * Math.PI / 180);
		d.y = population[i].pos.y + 370* Math.sin((population[i].neurons[12]) * Math.PI / 180);
		
		c.x = population[i].pos.x + 370* Math.cos((population[i].neurons[12]-30) * Math.PI / 180);
		c.y = population[i].pos.y + 370* Math.sin((population[i].neurons[12]-30) * Math.PI / 180);
		
		for(var i1 = 0;i1<population.size;i1++)
		{
			//left eye
			if(intpoint_inside_trigon(population[i1].pos.x,population[i1].pos.y,a.x,a.y,b.x,b.y,d.x,d.y))
			{
				population[i].neurons[0] = 1;
				population[i].neurons[2] = 0;
				population[i].neurons[4] = Math.sqrt((population[i].pos.x-population[i1].pos.x)*(population[i].pos.x-population[i1].pos.x) + (population[i].pos.y-population[i1].pos.y)*(population[i].pos.y-population[i1].pos.y))/370;
			}
			//right eye
			if(intpoint_inside_trigon(population[i1].pos.x,population[i1].pos.y,a.x,a.y,c.x,c.y,d.x,d.y))
			{
				population[i].neurons[1] = 1;
				population[i].neurons[3] = 0;
				population[i].neurons[5] = Math.sqrt((population[i].pos.x-population[i1].pos.x)*(population[i].pos.x-population[i1].pos.x) + (population[i].pos.y-population[i1].pos.y)*(population[i].pos.y-population[i1].pos.y))/370;
		
			}
			for(j=0;j<population[i1].bullet_count;j++)
			{
				//left eye
				if(intpoint_inside_trigon(population[i1].bullets[j].pos.x,population[i1].bullets[j].pos.y,a.x,a.y,b.x,b.y,d.x,d.y) && i1!=i)
				{
					population[i].neurons[0] = 1;
					population[i].neurons[2] = 1;
					population[i].neurons[4] = Math.sqrt((population[i].pos.x-population[i1].bullets[j].pos.x)*(population[i].pos.x-population[i1].bullets[j].pos.x) + (population[i].pos.y-population[i1].bullets[j].pos.y)*(population[i].pos.y-population[i1].bullets[j].pos.y))/370;
		
				}
				//right eye
				if(intpoint_inside_trigon(population[i1].bullets[j].pos.x,population[i1].bullets[j].pos.y,a.x,a.y,c.x,c.y,d.x,d.y) && i1!=i)
				{
					population[i].neurons[1] = 1;
					population[i].neurons[3] = 1;
					population[i].neurons[5] = Math.sqrt((population[i].pos.x-population[i1].bullets[j].pos.x)*(population[i].pos.x-population[i1].bullets[j].pos.x) + (population[i].pos.y-population[i1].bullets[j].pos.y)*(population[i].pos.y-population[i1].bullets[j].pos.y))/370;

				}
			}
		}
		
		population[i].neurons[6] = 1/1+Math.exp(  -  ((population[i].neurons[0]*population[i].synapses[0])   +  (population[i].neurons[1]*population[i].synapses[1])     +     (population[i].neurons[2]*population[i].synapses[2])        +         (population[i].neurons[3]*population[i].synapses[3])     +    (population[i].neurons[4]*population[i].synapses[4])    +    (population[i].neurons[5]*population[i].synapses[5])));
		population[i].neurons[7] = 1/1+Math.exp(  -  ((population[i].neurons[0]*population[i].synapses[6])   +  (population[i].neurons[1]*population[i].synapses[7])     +     (population[i].neurons[2]*population[i].synapses[8])        +         (population[i].neurons[3]*population[i].synapses[9])     +    (population[i].neurons[4]*population[i].synapses[10])    +    (population[i].neurons[5]*population[i].synapses[11])));
		population[i].neurons[8] = 1/1+Math.exp(  - ( (population[i].neurons[0]*population[i].synapses[12])   +  (population[i].neurons[1]*population[i].synapses[13])     +     (population[i].neurons[2]*population[i].synapses[14])        +         (population[i].neurons[3]*population[i].synapses[15])     +    (population[i].neurons[4]*population[i].synapses[16])    +    (population[i].neurons[5]*population[i].synapses[17])));
		population[i].neurons[9] = 1/1+Math.exp(  - ( (population[i].neurons[0]*population[i].synapses[18])   +  (population[i].neurons[1]*population[i].synapses[19])     +     (population[i].neurons[2]*population[i].synapses[20])        +         (population[i].neurons[3]*population[i].synapses[21])     +    (population[i].neurons[4]*population[i].synapses[22])    +    (population[i].neurons[5]*population[i].synapses[23])));
		population[i].neurons[10] = 1/1+Math.exp( -  ( (population[i].neurons[6]*population[i].synapses[24])   +  (population[i].neurons[7]*population[i].synapses[25])     +     (population[i].neurons[8]*population[i].synapses[26])        +         (population[i].neurons[9]*population[i].synapses[27])));
		population[i].neurons[11] = 1/1+Math.exp(  - ( (population[i].neurons[6]*population[i].synapses[28])   +  (population[i].neurons[7]*population[i].synapses[29])     +     (population[i].neurons[8]*population[i].synapses[30])        +         (population[i].neurons[9]*population[i].synapses[31])));
		population[i].neurons[12] = 1/1+Math.exp(  - ( (population[i].neurons[6]*population[i].synapses[32])   +  (population[i].neurons[7]*population[i].synapses[33])     +     (population[i].neurons[8]*population[i].synapses[34])        +         (population[i].neurons[9]*population[i].synapses[35])));

		
		if(population[i].pos.x<canvas.width-population[i].size && population[i].pos.x>population[i].size)
		{
			population[i].pos.x += animation_speed*population[i].neurons[11]* Math.cos(population[i].neurons[12] * Math.PI / 180);
		}
		
		
		if(population[i].pos.y>population[i].size && population[i].pos.y<canvas.height-population[i].size)
		{
			population[i].pos.y += animation_speed*population[i].neurons[11]* Math.sin(population[i].neurons[12] * Math.PI / 180);
		}
	  
	  if(population[i].neurons[10]>0.5 && frames%(100/animation_speed) == 0)
	  {
		  population[i].bullets[population[i].bullet_count] = new Bullet(population[i].neurons[12]);
		   population[i].bullets[population[i].bullet_count].pos.x = population[i].pos.x;
		   population[i].bullets[population[i].bullet_count].pos.y = population[i].pos.y;
		  population[i].bullet_count++;
	  }
	  for(j=0;j<population[i].bullet_count;j++)
	  {
		  population[i].bullets[j].pos.x += animation_speed*4*Math.cos(population[i].bullets[j].oriantation * Math.PI / 180);
		  population[i].bullets[j].pos.y += animation_speed*4*Math.sin(population[i].bullets[j].oriantation * Math.PI / 180);
		  //print
		  context.beginPath();
		  context.arc(population[i].bullets[j].pos.x,  population[i].bullets[j].pos.y, 5, 0, 2 * Math.PI, false);
		  context.fillStyle = 'black';
		  context.fill();
		  context.lineWidth = 5;
		  context.strokeStyle = '#black';
		  context.stroke();
		  context.closePath();
		  //print
	  }
	  //print
      context.beginPath();
      context.arc(population[i].pos.x, population[i].pos.y, population[i].size, 0, 2 * Math.PI, false);
      context.fillStyle = 'green';
      context.fill();
      context.lineWidth = 1;
      context.strokeStyle = '#003300';
      context.stroke();
      context.closePath();
	  //print
	  //print eyes
	   context.beginPath();
      context.arc(population[i].pos.x, population[i].pos.y, 190, 0.0174532925*(population[i].neurons[12]-1), 0.0174532925*(population[i].neurons[12]+1), false);
      context.lineWidth = 300;
      context.strokeStyle = 'rgba(0,0,0, 0.05)';
      context.stroke();
      context.closePath();
	  
	   context.beginPath();
      context.arc(population[i].pos.x, population[i].pos.y, 190, 0.0174532925*(population[i].neurons[12]-31), 0.0174532925*(population[i].neurons[12]-30), false);
      context.lineWidth = 300;
      context.strokeStyle = 'rgba(0,0,0, 0.05)';
      context.stroke();
      context.closePath();
	  
	   context.beginPath();
      context.arc(population[i].pos.x, population[i].pos.y, 190, 0.0174532925*(population[i].neurons[12]+30), 0.0174532925*(population[i].neurons[12]+31), false);
      context.lineWidth = 300;
      context.strokeStyle = 'rgba(0,0,0, 0.05)';
      context.stroke();
      context.closePath
	  if(population[i].neurons[1]==1)
	  {
		  
		  if(population[i].neurons[3]==1)
		  {
			  context.beginPath();
			  context.arc(population[i].pos.x, population[i].pos.y, 190, 0.0174532925*(population[i].neurons[12]-30), 0.0174532925*population[i].neurons[12], false);
			  context.lineWidth = 300;
			  context.strokeStyle = 'rgba(0,0,0, 0.2)';
			  context.stroke();
			  context.closePath();
		  }
		  else
		  {
			  context.beginPath();
		  context.arc(population[i].pos.x, population[i].pos.y, 190, 0.0174532925*(population[i].neurons[12]-30), 0.0174532925*population[i].neurons[12], false);
		  context.lineWidth = 300;
		  context.strokeStyle = 'rgba(255,0,0, 0.2)';
		  context.stroke();
		  context.closePath();
		  }
	  }
	  else
	  {
		  
			  context.beginPath();
			  context.arc(population[i].pos.x, population[i].pos.y, 190, 0.0174532925*(population[i].neurons[12]-30), 0.0174532925*population[i].neurons[12], false);
			  context.lineWidth = 300;
			  context.strokeStyle = 'rgba(255,0,0, 0.05)';
			  context.stroke();
			  context.closePath();
		  
	  }
	  
	  
	  
	  
	  if(population[i].neurons[0]==1)
	  {
		 
		   if(population[i].neurons[2]==1)
		  {
			  context.beginPath();
			  context.arc(population[i].pos.x, population[i].pos.y, 190, 0.0174532925*population[i].neurons[12], 0.0174532925*(population[i].neurons[12]+30), false);
			  context.lineWidth = 300;
			  context.strokeStyle = 'rgba(0,0,0, 0.2)';
			  context.stroke();
			  context.closePath();

		  }
		  else
		  {
			   context.beginPath();
		  context.arc(population[i].pos.x, population[i].pos.y, 190, 0.0174532925*population[i].neurons[12], 0.0174532925*(population[i].neurons[12]+30), false);
		  context.lineWidth = 300;
		  context.strokeStyle = 'rgba(255,0,0, 0.2)';
		  context.stroke();
		  context.closePath();
		  }
	  }
	  else
	  {
		 
			  context.beginPath();
			  context.arc(population[i].pos.x, population[i].pos.y, 190, 0.0174532925*population[i].neurons[12], 0.0174532925*(population[i].neurons[12]+30), false);
			  context.lineWidth = 300;
			  context.strokeStyle = 'rgba(255,0,0, 0.05)';
			  context.stroke();
			  context.closePath();
	  }
	  //print eyes
	}
}

callback();























