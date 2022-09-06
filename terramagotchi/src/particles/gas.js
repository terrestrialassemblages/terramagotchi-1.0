import { AirParticle } from "./air";
import { BaseParticle } from "./base";

export class GasParticle extends BaseParticle {
    constructor() {
        super();
        this.horizontal_chance = 0.25;
    }

    compute_rise(x, y, grid) {
        let particle_above = grid.get(x, y+1);
        let can_move_above = particle_above.moveable && (particle_above.weight < this.weight || particle_above instanceof AirParticle);

        // Attempt to rise upwards
        if (can_move_above) {
            // Move upwards
            grid.swap(x,y,x,y+1);
            // Update y variable
            y++;
        }

        // Randomly decide to move horizontally
        if (Math.random() < this.horizontal_chance) {
            // Randomly choose an x direction to move towards
            let rdm_direction = Math.sign(Math.random() - 0.5)

            let particle_infront = grid.get(x+rdm_direction,y);
            let can_move_infront = particle_infront.moveable && (particle_infront.weight < this.weight || particle_infront instanceof AirParticle);

            // Try move in the random x direction
            if (can_move_infront) {
                grid.swap(x,y,x+rdm_direction,y);
            }
        }
    }
}