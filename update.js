//population size
    		var population_slider_var = document.getElementById("population_slider");
    		var population_output_var = document.getElementById("population_output");
    		population_output_var.innerHTML = population_size;
    		population_slider_var.value = population_size;

    		population_slider_var.oninput = function() {
    			population_output_var.innerHTML = this.value;
    		}

    		//lifespan
    		var lifespan_slider_var = document.getElementById("lifespan_slider");
    		var lifespan_output_var = document.getElementById("lifespan_output");
    		lifespan_output_var.innerHTML = lifespan;
    		lifespan_slider_var.value = lifespan;

    		lifespan_slider_var.oninput = function() {
    			lifespan_output_var.innerHTML = this.value;
    		}

    		//mutation rate
    		var mutation_rate_slider_var = document.getElementById("mutation_rate_slider");
    		var mutation_rate_output_var = document.getElementById("mutation_rate_output");
    		mutation_rate_output_var.innerHTML = mutation_rate * 100;
    		mutation_rate_slider_var.value = mutation_rate;

    		mutation_rate_slider_var.oninput = function() {
    			mutation_rate_output_var.innerHTML = this.value * 100;
    		}
