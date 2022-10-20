import { OrganicParticle } from "./organic";
import { AirParticle } from "./air";
import { CompostParticle } from "./compost";
import { WaterParticle } from "./water";
import { FastRandom } from "../fast-random";

export class SoilParticle extends OrganicParticle {
    constructor(x, y) {
        super(x, y);

        this.base_color = "#92745B";

        this.water_level = this.water_capacity;
        this.nutrient_level = this.nutrient_capacity;

        // Poisson distribution chance to grow grass
        this.grass_grow_chance = 0.001;
    }

    update(environment) {
        this.compute_gravity(environment)
        this.compute_erosion(environment)

        this.absorb_from_neighbours(environment, [[0, 1], [1, 0], [0, -1], [-1, 0]], [SoilParticle]);

        this.grass_growth(environment);
    }

    grass_growth(environment) {

        // Has not moved, Particle above is Air and Poisson Distribution chance
        if (this.moveable_x &&
            this.moveable_y && 
            environment.get(this.x,this.y+1) instanceof AirParticle && 
            FastRandom.random() < this.grass_grow_chance) {
            // Grow grass
            environment.set(new GrassParticle(this.x,this.y+1));
        }
    }
}

export class GrassParticle extends SoilParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#44B300";

        this.water_level = 0;
        this.nutrient_level = 0;

        this.water_capacity = 50;
        this.nutrient_capacity = 50;

        // Chance for this Grass particle to grow extra grass above it
        this.stacked_grass_chance = 0.2;
        this.grow_stacked_grass = FastRandom.random() < this.stacked_grass_chance;

        // Poisson distribution chance to die
        this.grass_death_chance = 0.005;
    }

    update(environment) {
        this.compute_gravity(environment);

        this.absorb_from_neighbours(environment, [[0, 1], [1, 0], [0, -1], [-1, 0]], [SoilParticle]);

        this.compute_transpiration(environment);

        if (this.grow_stacked_grass) this.grass_growth(environment);
        this.grass_death(environment);
    }

    grass_death(environment) {

        let particel_above = environment.get(this.x,this.y+1);

        // Particle above is not Air, Water or Grass, and Poisson Distribution chance
        if (!(particel_above instanceof AirParticle || 
            particel_above instanceof GrassParticle || 
            particel_above instanceof WaterParticle) && 
            FastRandom.random() < this.grass_death_chance) {
            // Kill Grass (Turn into Compost)
            let new_compost = new CompostParticle(this.x,this.y);
            new_compost.nutrient_level = this.nutrient_level;
            new_compost.water_level = this.water_level;
            environment.set(new_compost);
        }
    }
}