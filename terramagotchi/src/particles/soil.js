import { OrganicParticle } from "./organic";
import { AirParticle } from "./air";
import { CompostParticle } from "./compost";

export class SoilParticle extends OrganicParticle {
    constructor(x, y) {
        super(x, y);

        this.base_color = "#92745B";
        this.moveable = true;
        this.weight = 2;

        this.water_level = 30;
        this.nutrient_level = 30;

        // Poisson distribution chance to grow grass
        this.grass_grow_chance = 0.0005;
    }

    update(environment) {
        this.compute_gravity(environment)
        this.compute_erosion(environment)

        this.absorb_water(environment, [[0, 1], [1, 0], [0, -1], [-1, 0]], [SoilParticle]);
        this.absorb_nutrients(environment, [[0, 1], [1, 0], [0, -1], [-1, 0]], [SoilParticle]);

        this.grass_growth(environment);
    }

    grass_growth(environment) {

        // Has not moved, Particle above is Air and Poisson Distribution chance
        if (this.moveable_x && this.moveable_y && 
            environment.get(this.x,this.y+1) instanceof AirParticle && 
            Math.random() < this.grass_grow_chance) {
            // Grow grass
            environment.set(new GrassParticle(this.x,this.y+1));
        }
    }

    get is_grass() {
        return this.base_color == this.grass_color;
    }

    get_color(s) {

        // Initialise colour if needed
        if (this.color === "#000000" || this.change_color) {
            super.get_color(s);
        }

        this.color = s.color(
            s.hue(this.color),
            s.saturation(this.base_color) * this.saturation_offset,
            s.brightness(this.base_color) * this.brightness_offset -
                this.water_level / 4
        );
        return this.color;
    }
}

class GrassParticle extends SoilParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#44B300";

        this.water_level = 0;
        this.nutrient_level = 0;

        // Chance for this Grass particle to grow extra grass above it
        this.stacked_grass_chance = 0.2;
        this.grow_stacked_grass = Math.random() < this.stacked_grass_chance;

        // Poisson distribution chance to die
        this.grass_death_chance = 0.001;
    }

    update(environment) {
        this.compute_gravity(environment);

        this.absorb_water(environment, [[0, 1], [1, 0], [0, -1], [-1, 0]], [SoilParticle]);
        this.absorb_nutrients(environment, [[0, 1], [1, 0], [0, -1], [-1, 0]], [SoilParticle]);

        if (this.grow_stacked_grass) this.grass_growth(environment);
        this.grass_death(environment);
    }

    grass_death(environment) {

        let particel_above = environment.get(this.x,this.y+1);

        // Particle above is not Air or Grass, and Poisson Distribution chance
        if (!(particel_above instanceof AirParticle || particel_above instanceof GrassParticle) && 
            Math.random() < this.grass_death_chance) {
            // Kill Grass (Turn into Compost)
            let new_compost = new CompostParticle(this.x,this.y);
            new_compost.nutrient_content = this.nutrient_level;
            new_compost.water_content = this.water_level;
            environment.set(new_compost);
        }
    }
}