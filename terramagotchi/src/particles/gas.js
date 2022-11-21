import { FastRandom } from "../fast-random";
import { BaseParticle } from "./base";

export class GasParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y)
        this.x_move_probability = 0.3
        this.up_move_probability = 1
        this.down_move_probability = 0.1
    }

    compute_rise(environment) {
        // Can move vertically this tick
        if (this.moveable_y) {
            const particle_above = environment.get(this.x, this.y + 1)
            const particle_below = environment.get(this.x, this.y - 1)

            // Attempt to rise upwards first
            if (!(particle_above instanceof GasParticle) &&
                Math.random() < this.up_move_probability &&
                particle_above.moveable_y &&
                particle_above.weight <= this.weight
            ) {
                // Move upwards
                environment.swap(this.x, this.y, this.x, this.y + 1)
            }
            // Attempt to move downwards if rising upwards didn't work
            else if (!(particle_below instanceof GasParticle) &&
                     Math.random() < this.down_move_probability &&
                     particle_below.moveable_y &&
                     particle_below.weight <= this.weight
            ) {
                // Move downwards
                environment.swap(this.x, this.y, this.x, this.y - 1)
            }

            // Randomly decide to move horizontally
            if (FastRandom.random() < this.x_move_probability) {
                // Randomly choose an x direction to move towards
                const random_direction = Math.sign(FastRandom.random() - 0.5);
                const random_x_neighbour = environment.get(this.x + random_direction, this.y);
                // Try move in the random x direction
                if (!(random_x_neighbour instanceof GasParticle) && 
                    random_x_neighbour.moveable_x && 
                    random_x_neighbour.weight <= this.weight
                ) {
                    environment.swap(this.x, this.y, this.x + random_direction, this.y)
                }
            }
        }
    }
}
