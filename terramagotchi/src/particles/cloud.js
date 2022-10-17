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
        this.cloud_move_probability = 0.25;

        // Incriment cloud particle count
        environment.cloud_particle_count++;
    }

    update(environment) {
        this.lifetime++;

        this.compute_cloud_structure(environment);
    }

    destroy(environment) {
        super.destroy(environment)

        environment.cloud_particle_count--;
    }

    get_cloud_horizon(new_x, environment) {
        return 5 * environment.noise2D(new_x / 64,0) + 280
    }

    compute_cloud_structure(environment) {
        if (this.moveable_y) {

            let [new_x, new_y] = [[0, 1], [1, 0], [0, -1], [-1, 0]][(Math.random() * 4) | 0];
            [new_x, new_y] = [this.x + new_x, this.y + new_y]

            const particle_ahead = environment.get(new_x, new_y)

            if (!(particle_ahead instanceof CloudParticle) &&
                Math.random() < this.cloud_move_probability &&
                this.cloud_noise(new_x, new_y, environment) > this.cloud_noise(this.x, this.y, environment) &&
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