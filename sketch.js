var current_population;  // Current population
var target; // target 
var population_size = 200; // total population size
var completed = 0; // Total number of individuals hit Target
var mutation_rate = 0.05; // mutation_rate
var generation = 1; // Total individuals reached to the target in current generation
var max_till_now = 0; // Maximum individuals reached to the target in single generation
var alive = 0; // ALive individuals in current generation
var dead = 0; // dead individuals in current generation
var lifespan = 500;  // lifespan of population
var maxChangeInVelocity = 0.5; // Maximum change in velocity of individuals
var count = 0; // Total frames of current population

// obstacle variables;
var ow // obstracle width
var oh // obstracle height
var ox // x coordinate of obstracle
var oy // y coordinate of obstracle

function setup(){
	// initalize function of p5js framework
	createCanvas(1200,900); 
	current_population = new population(); //create new population
	target =  createVector(width/2, 250);  // set target
	
	// set obstacles veriables
	ow = 300;
	oh = 15;
	ox = (width/2)-(ow/2);
	oy = height/2;
}

function draw(){
	// Draw function iterates over and over to draw in canvus.

	background(90); // background colour.
	current_population.run(); // exicuting operations on current population
	count++;
	if (count == lifespan || dead + completed == population_size){
		// Create new generation
		count = 0;
		generation++;
		current_population.evaluate();
		current_population.selection();

		population_size = population_slider_var.value;
		lifespan = lifespan_slider_var.value;
		maxChangeInVelocity = change_velocity_slider_var.value;
		mutation_rate = mutation_rate_slider_var.value;
	}

	// draw target circle
    noStroke();
	fill(255, 100);
	circle(target.x, target.y, 100);
	fill(200);
	rect(ox,oy,ow,oh);

	// statistics of current generation
    let mid = (width - 500) / 2;
	print_stats(mid, 20,"Generation",generation);
	print_stats(mid, 40,"Population",population_size);
	print_stats(mid, 60,"Dead",dead);
	print_stats(mid, 80,"Alive",alive);
    print_stats(mid, 100,"remaining lifespan", lifespan - count);
    print_stats(mid, 120,"Total individuals reached to the target in current generation", completed);
	print_stats(mid, 140,"Maximum individuals reached to the target in single generation",max_till_now);
    fill(255);
    
    // write target on the target circle
    text("Target", target.x - 22, target.y + 7);

}

// print stats on canvas
function print_stats(x,y,label,val, gap = 500){
	textSize(15);
	text(label + " : ", x, y, gap);
	text(val, x + gap, y, gap);
}




// population class
function population(){
	// array of individuals
	this.individuals = [];

    // create new individuals
	for (var i = 0; i < population_size; i++) {
		this.individuals[i] = new individual();
	};

	// run or move all inviduals or population
	// this run function will exicute in each frame
	this.run = function(){
		var comp = 0;     // count of individuals who reached the target in current population
		var cur_dead = 0; // count of individuals who are dead in current population
		var cur_alive = 0; // count of individuals who are alive in current population

		for (var i = 0; i < this.individuals.length; i++) {
			// update position of individual
			this.individuals[i].update();

			// show updated position on canvas
			this.individuals[i].show();


			if(this.individuals[i].crashed || this.individuals[i].crashed_obstacle){
				cur_dead++;
			}else{
				cur_alive++;
			} 
			if (this.individuals[i].completed){
				comp++;
			}
		};
		completed = comp;
		dead = cur_dead;
		alive =  cur_alive;

		if(max_till_now < completed){
			max_till_now = completed;
		}
	}


	// find fitness of all individuals and sort them according to fitness
	this.evaluate = function(){
		this.maxfit = 0;
		for (var i = 0; i < population_size; i++) {
			this.individuals[i].calc_fitness();
		}	

		this.individuals.sort((a, b) => (a.fitness > b.fitness ? 1 : ((b.fitness > a.fitness) ? -1 : 0)));
	}


	// generate new or next population
	this.selection = function(){
		var newindividuals = [];
		var top_10 = Math.floor(population_size / 10); // 10% of total population
        var top_50 = Math.floor(population_size / 2); // 50% of total population
		for(var i = 0; i < Math.min(top_50, population_slider_var.value - 1); i++){
			newindividuals.push(new individual(this.individuals[i].dna));
		}

		for(var i = Math.min(top_50, population_slider_var.value - 1); i < population_slider_var.value; i++){
			parent1 = this.individuals[Math.floor(random(0, top_10))].dna;
			parent2 = this.individuals[Math.floor(random(0, top_10))].dna;
			child = parent1.crossover(parent2);
			child.mutate();
			newindividuals.push(new individual(child));
		}

		this.individuals = newindividuals;
	}
}







// individual class
function individual(dna_of_offspring){
	this.pos = createVector(width/2, height); // initial position of individual
	this.vel = createVector(); // vel will be added to pos to change the position of individual and vel will change according to genes
	// state of individual
	this.completed = false;
	this.crashed = false;
	this.crashed_obstacle = false;
	// colour of individual
	this.colr = round(random(255));
	this.colg = round(random(255));
	this.colb = round(random(255));

	if (dna_of_offspring) {
		this.dna = dna_of_offspring; // if dna is given as argument
	}
	else{
		this.dna = new dna();	
	}

	// initial fitness
	this.fitness = 0;

	// calculate fitness
	this.calc_fitness = function(){
		var d = dist(this.pos.x, this.pos.y, target.x, target.y);
		if(d < 60 || completed){
			this.fitness = d / (lifespan + 1 - count);
		}
		else if(this.fitness < 300){
			this.fitness = d / ((lifespan + 1 - count) / 10);
		}
		else{
			this.fitness = d;
		}
		if (this.crashed_obstacle){
			this.fitness *= (20 * (lifespan + 1 - count));
		}
		if(this.crashed){
			this.fitness *= (10 * (lifespan + 1 - count));
		}
	}

	// update individual's pos and state
	this.update = function(){
		d = dist(this.pos.x,this.pos.y,target.x,target.y);
		if(d < 60){
			this.completed = true;
			this.pos = target.copy();
		}
		if(this.pos.x > ox && this.pos.x < ox+ow && this.pos.y > oy && this.pos.y< oy+oh){
			this.crashed_obstacle = true;
		}
		if(this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height){
			this.crashed = true;
		}

		if(!this.completed && !this.crashed && !this.crashed_obstacle){
			this.vel.add(this.dna.genes[count]);
			this.pos.add(this.vel);
		}
	}

	// show individual on canvas
	this.show = function(){
		push();
		translate(this.pos.x, this.pos.y);
		rotate(this.vel.heading());
		rectMode(CENTER);
		noStroke();
		if (this.completed){
			fill(0, 255, 0);
		}
		else if (this.crashed || this.crashed_obstacle){
			fill(255,0,0,200);
		}else{
			fill(this.colr,this.colg,this.colb,150);
		}
		rect(0, 0, 20, 10, 100);
		pop();
	}
}









// DNA class
function dna(genes){
	if (genes) {
		this.genes = genes // if genes are given as argument
	}
	else{
		this.genes = [];

		for (var i = 0; i < lifespan_slider_var.value; i++) {
			this.genes[i] = p5.Vector.random2D();
			this.genes[i].setMag(random(maxChangeInVelocity));
		}
	}

	// crossover genes of this dna with dna of partner provided as argument
	this.crossover =  function(partner){
		var newgenes = [];
		var pivit = Math.floor(random(0, lifespan));
		for(var i = 0; i < pivit; i++){
			newgenes.push(this.genes[i]);
		}

		for(var i = pivit; i < lifespan; i++){
			newgenes.push(partner.genes[i]);
		}

		return new dna(newgenes); // return new dna object;
	}
	

	// mutate genes
	this.mutate = function(){
		for(var i=0; i<this.genes.length; i++){
			if(random(0, 1) < mutation_rate){
				this.genes[i] = p5.Vector.random2D();
				this.genes[i].setMag(maxChangeInVelocity);
			}
		}
	}
}
