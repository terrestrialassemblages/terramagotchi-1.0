import { GasParticle } from "./gas";
import { WaterParticle } from "./water";

export class SteamParticle extends GasParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#EEE";
        //this.color_variance = 0;
        this.moveable = true;
        this.weight = 0;

        // How much water this particle contains
        this.water_content = 10;
        // How many ticks the steam particle has existed
        this.lifetime = 0;

        // Chance to move when computing cloud function
        this.cloud_move_probability = 0.25;
    }

    update(environment) {
        this.lifetime++;

        //this.compute_rain(environment);

        if (this.under_cloud_horizon(this.x, this.y, environment)) {
            this.compute_rise(environment);
        }
        else {
            this.compute_clouds(environment);
        }
    }
4
    compute_rain() {
        // Turn steam into water.
        if (this.condensation_time > 3600) {
            let new_water = new WaterParticle(this.x, this.y)
            new_water.water_content = this.water_content;
            environment.set(new_water);
            return;
        }
    }

    under_cloud_horizon(new_x, new_y, environment) {
        return new_y < 5 * environment.noise2D(new_x / 64,0) + 280
    }

    compute_clouds(environment) {
        if (this.moveable_y) {

            let [new_x, new_y] = [[0, 1], [1, 0], [0, -1], [-1, 0]][(Math.random() * 4) | 0];
            [new_x, new_y] = [this.x + new_x, this.y + new_y]

            const particle_ahead = environment.get(new_x, new_y)

            if (!(particle_ahead instanceof GasParticle) &&
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
        if (!this.under_cloud_horizon(new_x, new_y, environment)) {
            return environment.noise2D((1000 + new_x / 128), (1000 + new_y) / 16)
        }
        return -2
    }
}
4