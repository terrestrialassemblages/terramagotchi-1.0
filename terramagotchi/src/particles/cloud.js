import { FastRandom } from "../fast-random";
import { AirParticle } from "./air";
import { InorganicParticle } from "./inorganic";
import { WaterParticle } from "./water";

export class CloudParticle extends InorganicParticle {
    constructor(x, y, water_level, environment) {
        super(x, y);
        this.base_color = "#FFF";
        //this.color_variance = 0;
        this.moveable = true;
        this.weight = 0;

        // How much water this particle contains
        this.water_level = water_level;

        // Chance to move when computing cloud function
        this.move_probability = 0.25;

        // When raining, per-tick chance to create water droplet
        this.rain_droplet_chance = 0.0004;
        // When raining, how much water_level to transfer to new droplet
        this.rain_droplet_water_level = 5;

        // Increment cloud particle count
        environment.cloud_particle_count++;
    }

    update(environment) {
        this.lifetime++;

        this.compute_cloud_structure(environment);
        this.compute_rain(environment)
    }

    destroy(environment) {
        super.destroy(environment)

        environment.cloud_particle_count--;
    }

    compute_rain(environment) {
        // Create rain / water droplets in correct conditions 
        if (environment.is_raining &&
            FastRandom.random() < this.rain_droplet_chance &&
            environment.get(this.x, this.y - 1) instanceof AirParticle) {

            // How much water_level to transfer to the new steam particle
            let transfer_amount = Math.min(this.rain_droplet_water_level, this.water_level);
            // Create new steam particle
            environment.set(new WaterParticle(this.x, this.y - 1, transfer_amount))
            // Remove water_level
            this.water_level -= transfer_amount

            // Has transferred all remaining water
            if (this.water_level == 0) {
                // Replace with air
                environment.set(new AirParticle(this.x, this.y));
            }
        }
    }

    get_cloud_horizon(new_x, environment) {
        return 5 * environment.noise2D(new_x / 64,0) + 280
    }

    // Move cloud particles to form cloud structures based on Noise2D
    compute_cloud_structure(environment) {
        if (this.moveable_y) {

            let [new_x, new_y] = FastRandom.choice([[0, 1], [1, 0], [0, -1], [-1, 0]]);
            [new_x, new_y] = [this.x + new_x, this.y + new_y]

            const particle_ahead = environment.get(new_x, new_y)

            if (!(particle_ahead instanceof CloudParticle) &&
                Math.random() < this.move_probability &&
                this.cloud_noise(new_x, new_y, environment) > this.cloud_noise(this.x, this.y, environment) &&
                particle_ahead.moveable_x &&
                particle_ahead.moveable_y &&
                particle_ahead.weight <= this.weight
            ) {
                environment.swap(this.x, this.y, new_x, new_y)
            }
        }
    }

    cloud_noise(new_x, new_y, environment) {
        if (new_y >= this.get_cloud_horizon(new_x, environment)) {
            return environment.noise2D((1000 + new_x / 128), (1000 + new_y) / 16)
        }
        return new_y - this.get_cloud_horizon(new_x, environment)
    }
}