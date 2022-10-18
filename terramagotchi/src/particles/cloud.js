import { FastRandom } from "../fast-random";
import { AirParticle } from "./air";
import { InorganicParticle } from "./inorganic";
import { WaterParticle } from "./water";

export class CloudParticle extends InorganicParticle {
    constructor(x, y, water_level, environment) {
        super(x, y);
        
        // Color of particle when not raining
        this.clear_color = "#FFF";
        // Color of particle when raining
        this.rain_color = "#BBB";

        this.base_color = this.clear_color;
        this.color_variance = 0.03;
        this.moveable = true;
        this.weight = 0;

        // How much water this particle contains
        this.water_level = water_level;

        // Chance to move when computing cloud function
        this.move_probability = 0.1;

        // When raining, per-tick chance to create water droplet
        this.rain_droplet_chance = 0.0004;
        // When raining, how much water_level to transfer to new droplet
        this.rain_droplet_water_level = 50;

        // Amount of brightness offset to apply when in shadow 
        this.shadow_strength = 20;
        // Whether this cloud particle is in shadow
        this.in_shadow = false;

        // Per-tick chance for this cloud particle to change color due to rain conditions or shadows
        this.color_change_chance = 0.005;

        // Increment cloud particle count
        environment.cloud_particle_count++;
    }

    update(environment) {
        this.lifetime++;

        this.compute_cloud_structure(environment);
        this.compute_rain(environment);

        if (FastRandom.random() < this.color_change_chance) {
            this.compute_lighting(environment);
            this.compute_color_by_rain(environment);
        }
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

    compute_lighting(environment) {

        if (environment.get(this.x, this.y + 3) instanceof AirParticle) {
            if (this.in_shadow != 0) {

                this.in_shadow = 0;
                this.rerender = true;
            }
        }
        else if (environment.get(this.x, this.y - 3) instanceof AirParticle) {
            if (this.in_shadow != 1) {

                this.in_shadow = 1;
                this.rerender = true;
            }
        }
    }

    compute_color_by_rain(environment) {
        
        // Is currently raining
        if (environment.is_raining) {

            // Change color to grey 
            if (this.base_color != this.rain_color) {

                this.base_color = this.rain_color;
                this.color = "#FF00FF";
                this.rerender = true;
            }
        }
        // Is not currently raining
        else {
            // Change color to white 
            if (this.base_color != this.clear_color) {

                this.base_color = this.clear_color;
                this.color = "#FF00FF";
                this.rerender = true;
            }
        }
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
    }4

    cloud_noise(new_x, new_y, environment) {
        return environment.noise2D(1000 + ((environment.cloud_noise_offset + new_x) / 128), 1000 + (new_y / 16))
    }

    // Function to initalise random colour variation and update colour when needed
    get_color(s) {
        // Initialise colour if needed
        if (this.color === "#FF00FF") {
            super.get_color(s);
        }

        this.color = s.color(
            s.hue(this.color),
            s.saturation(this.base_color) * this.saturation_offset,
            s.brightness(this.base_color) * this.brightness_offset - this.in_shadow * this.shadow_strength
        );
        return this.color;
    }
}