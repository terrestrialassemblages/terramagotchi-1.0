import { BaseParticle } from "./base";

export class LiquidParticle extends BaseParticle {
    constructor() {
        super();
        this.flow_direction = 1;
    }

    compute_flow(x, y, grid) {
        let particle_forward = grid.get(x+this.flow_direction,y);
        let particle_backward = grid.get(x-this.flow_direction,y);

        let can_move_forward = particle_forward.moveable_x && particle_forward.weight < this.weight;
        let can_move_backward = particle_backward.moveable_x && particle_backward.weight < this.weight;

        // Particle ahead cannot be moved
        if (!can_move_forward && can_move_backward) {
            // Swap direction
            this.flow_direction *= -1;

            let temp1 = particle_forward;
            particle_forward = particle_backward;
            particle_backward = temp1;

            let temp2 = can_move_forward;
            can_move_forward = can_move_backward;
            can_move_backward = temp2;
        }

        // Has space to move forward
        if (can_move_forward) {
            // Move ahead
            grid.swap(x,y,x+this.flow_direction,y);
            // Reattempt gravity after flowing
            if (this.moveable)
                this.compute_gravity(x+this.flow_direction, y, grid);
        }
    }
}