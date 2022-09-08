import { BaseParticle } from "./base";

export class GasParticle extends BaseParticle {
    constructor() {
        super();
        this.x_movement_probability = 0.25;
    }

    compute_rise(x, y, environment) {
        this.moveable_y = true;

        const particle_above = environment.get(x, y + 1);

        // Attempt to rise upwards
        if (
            particle_above.moveable_y &&
            particle_above.weight <= this.weight &&
            !(particle_above instanceof GasParticle)
        ) {
            // Move upwards and increment y
            environment.swap(x, y, x, ++y);
        }

        // Randomly decide to move horizontally
        if (Math.random() < this.x_movement_probability) {
            // Randomly choose an x direction to move towards
            const random_direction = Math.sign(Math.random() - 0.5);
            const random_x_neighbour = environment.get(x + random_direction, y);
            // Try move in the random x direction
            if (
                random_x_neighbour.moveable_x &&
                random_x_neighbour.weight <= this.weight
            ) {
                environment.swap(x, y, x + random_direction, y);
                return [x + random_direction, y];
            }
        }

        return [x, y];
    }
}
