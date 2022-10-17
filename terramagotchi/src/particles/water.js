import { FastRandom } from "../fast-random";
import { AirParticle } from "./air";
import { LiquidParticle } from "./liquid";
import { OrganicParticle } from "./organic";
import { SteamParticle } from "./steam";

export class WaterParticle extends LiquidParticle {
    constructor(x, y, water_level = 1000) {
        super(x, y);
        this.base_color = "#5080D0";
        this.moveable = true;
        this.weight = 1;
        this.water_content = water_level;

        // Per-tick chance to evaporate into steam
        this.evaporation_chance = 0.0001;
        // How much water_level to evaporate
        this.evaporate_water_level = 50;
    }

    update(environment) {
        this.compute_gravity(environment);
        this.compute_flow(environment);
        this.compute_gravity(environment);

        this.disperse_water(environment)
        this.compute_evaporate(environment)
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

    compute_evaporate(environment) {
        // Evaporate water into steam in correct conditions
        if (FastRandom.random() < this.evaporation_chance &&
            environment.get(this.x, this.y + 1) instanceof AirParticle &&
            !environment.is_raining &&
            this.water_content > 0 && 
            environment.light_level == 100) {

            // How much water_level to transfer to the new steam particle
            let transfer_amount = Math.min(this.evaporate_water_level, this.water_content);
            // Create new steam particle
            environment.set(new SteamParticle(this.x, this.y + 1, transfer_amount))
            // Remove water_content
            this.water_content -= transfer_amount

            // Has transferred all remaining water
            if (this.water_content == 0) {
                // Replace with air
                environment.set(new AirParticle(this.x, this.y));
            }
        }
    }
}
