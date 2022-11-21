import { OrganicParticle } from "./organic";
import { AirParticle } from "./air";
import { FastRandom } from "../fast-random";
import { ShootSystemParticle } from "./plants";
import { WaterParticle } from "./water";

export class CompostParticle extends OrganicParticle {
    constructor(x, y) {
        super(x, y);
        
        this.base_color = "#664E00";
        this.pass_through_types = [ ShootSystemParticle ];

        this.water_capacity = 0;
        this.nutrient_capacity = 0;

        this.water_level = 10;
        this.nutrient_level = 1000;

        this.decay_into = AirParticle;
    }

    update(environment) {
        this.compute_gravity(environment);
        this.compute_erosion(environment);

        this.compute_transpiration(environment);
        this.disperse_nutrients(environment);
    }

    disperse_nutrients(environment) {

        // Choose a random neighbour
        let [offset_x, offset_y] = FastRandom.choice([
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ]);
        let random_neighbour = environment.get(
            this.x + offset_x,
            this.y + offset_y
        );

        // Attempt to disperse nutrients or water
        if (random_neighbour instanceof OrganicParticle) {
            // Attempt nutrient dispersion
            if (random_neighbour.nutrient_level < random_neighbour.nutrient_capacity) {
                // Transfer as much nutrient as possible to neighbour
                let transfer_amount = Math.min(
                    this.nutrient_level,
                    random_neighbour.nutrient_capacity -
                        random_neighbour.nutrient_level
                );
                random_neighbour.nutrient_level += transfer_amount;
                this.nutrient_level -= transfer_amount;
            }

            // Attempt water dispersion
            if (random_neighbour.water_level < random_neighbour.water_capacity) {
                // Transfer as much water as possible to neighbour
                let transfer_amount = Math.min(
                    this.water_level,
                    random_neighbour.water_capacity -
                        random_neighbour.water_level
                );
                random_neighbour.water_level += transfer_amount;
                this.water_level -= transfer_amount;
            }

            // Transfered all nutrients
            if (this.nutrient_level == 0) {
                // Also transfered all water levels
                if (this.water_level == 0) {
                    environment.set(new this.decay_into(this.x, this.y));
                }
                // Some water level remains, convert to water particle
                else if (this.decay_into == AirParticle) {
                    environment.set(new WaterParticle(this.x, this.y, this.water_level))
                }
            }
        }
    }

    get_color(s) {
        //if (this.nutrient_capacity != 0) {
        //   s.push()
        //   s.colorMode(s.RGB)
        //   //this.color = s.color((this.water_level - 30) * 10)
        //   this.color = s.color((this.water_level / this.water_capacity) * 255)
        //   s.pop()
        //   return this.color
        //}
        // Initialise colour if needed
        if (this.color === "#FF00FF") {
            super.get_color(s);
        }

        this.color = s.color(
            s.hue(this.color),
            s.saturation(this.base_color) * this.saturation_offset,
            s.brightness(this.base_color) * this.brightness_offset
        );
        return this.color;
    }
}
