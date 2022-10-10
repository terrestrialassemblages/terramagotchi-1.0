import { FastRandom } from "../fast-random";
import { AirParticle } from "./air";
import { LiquidParticle } from "./liquid";
import { OrganicParticle } from "./organic";

export class WaterParticle extends LiquidParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#5080D0";
        this.moveable = true;
        this.weight = 1;
        this.water_content = 100;
    }

    update(environment) {
        this.compute_gravity(environment);
        this.compute_flow(environment);
        this.compute_gravity(environment);

        this.disperse_water(environment)
    }

    disperse_water(environment) {
        // Choose a random neighbour
        let [offset_x, offset_y] = FastRandom.choice([[0, 1], [1, 0], [0, -1], [-1, 0]]);
        let random_neighbour = environment.get(this.x + offset_x, this.y + offset_y);

        // Attempt to disperse water to random organic neighbour
        if (random_neighbour instanceof OrganicParticle && random_neighbour.water_level < random_neighbour.water_capacity) {
            // Transfer as much water as possible to neighbour
            let transfer_amount = Math.min(this.water_content, random_neighbour.water_capacity - random_neighbour.water_level)
            random_neighbour.water_level += transfer_amount;
            this.water_content -= transfer_amount;

            // Water has transfered as much as it can
            if (this.water_content == 0) {
                let new_air_particle = new AirParticle(this.x, this.y);
                environment.set(new_air_particle);

                // Move new air bubble to the top of liquid pool
                let check_liquid_y = this.y + 1;
                while(environment.get(this.x, check_liquid_y) instanceof LiquidParticle) {
                    new_air_particle.moveable_y = true;
                    environment.get(this.x, check_liquid_y).moveable_y = true;
                    environment.get(this.x, check_liquid_y).compute_gravity(environment);
                    check_liquid_y++;
                }
            }
        }
    }
}
