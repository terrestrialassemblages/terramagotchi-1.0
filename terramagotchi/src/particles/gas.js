import { FastRandom } from "../fast-random";
import { BaseParticle } from "./base";

export class GasParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y);
        this.x_movement_probability = 0.25;
    }

    compute_rise(environment) {
        // Can move vertically this tick
        if (this.moveable_y) {
            const particle_above = environment.get(this.x, this.y + 1);

            // Attempt to rise upwards
            if (
                particle_above.moveable_y &&
                particle_above.weight <= this.weight &&
                !(particle_above instanceof GasParticle)
            ) {
                // Move upwards
                environment.swap(this.x, this.y, this.x, this.y + 1);
            }

            // Randomly decide to move horizontally
            if (FastRandom.random() < this.x_movement_probability) {
                // Randomly choose an x direction to move towards
                const random_direction = Math.sign(FastRandom.random() - 0.5);
                const random_x_neighbour = environment.get(this.x + random_direction, this.y);
                // Try move in the random x direction
                if (
                    random_x_neighbour.moveable_x &&
                    random_x_neighbour.weight <= this.weight
                ) {
                    environment.swap(this.x, this.y, this.x + random_direction, this.y);
                }
            }
        }
    }
}
