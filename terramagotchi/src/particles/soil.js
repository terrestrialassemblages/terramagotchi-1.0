import { OrganicParticle } from "./organic";
import { CompostParticle } from "./compost";
import { AirParticle } from "./air";

export class SoilParticle extends OrganicParticle {
    constructor(x, y) {
        super(x, y);

        this.dirt_color = "#92745B";
        this.grass_color = "#44b300";

        this.base_color = this.dirt_color;
        this.moveable = true;
        this.weight = 2;

        this.water_level = 30;
        this.nutrient_level = 30;

        // Chance for this Soil particle to grow as grass underneath grass
        this.undergrow_chance = 0.3;
        this.do_undergrowth = Math.random() < this.undergrow_chance;
        // Poisson distribution chance for color change
        this.color_change_chance = 0.0005;
    }

    update(environment) {
        this.compute_gravity(environment)
        this.compute_erosion(environment)

        this.absorb_water(environment, [[0, 1], [1, 0], [0, -1], [-1, 0]], [SoilParticle]);

        this.absorb_nutrients(environment, [[0, 1], [1, 0], [0, -1], [-1, 0]], [SoilParticle]);

        this.compute_grass(environment);
    }

    compute_grass(environment) {
        // Has not moved
        if (this.moveable_x && this.moveable_y) {
            let particle_above = environment.get(this.x,this.y+1);

            // Air is above soil or grass is above soil and soil can do undergrowth
            if (particle_above instanceof AirParticle || 
                (this.do_undergrowth && particle_above instanceof SoilParticle && particle_above.is_grass)) {
                // Soil is not green (grass color)
                if (this.base_color != this.grass_color) {
                    // Gradually turn soil color to green via Poisson Distribution
                    if (Math.random() < this.color_change_chance) {
                        this.base_color = this.grass_color;
                        this.color = "#000000";
                        this.rerender = true;
                    }
                }
            }
            // Air is not above soil and no undergrowth
            else {
                // Soil is not brown (dirt color)
                if (this.base_color != this.dirt_color) {
                    // Gradually turn soil color to brown via Poisson Distribution
                    if (Math.random() < this.color_change_chance) {
                        this.base_color = this.dirt_color;
                        this.color = "#000000";
                        this.rerender = true;
                    }
                }
            }
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