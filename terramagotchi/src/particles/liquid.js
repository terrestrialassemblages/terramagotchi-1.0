import { BaseParticle } from "./base";

export class LiquidParticle extends BaseParticle {
    constructor() {
        super();
        this.flow_direction = 1;
    }

    compute_flow(x, y, environment) {
        
        // Can move horizontally and vertically this tick, and isn't above a ligher particle.
        if (this.moveable_x && this.moveable_y && environment.get(x,y-1).weight >= this.weight) {

            let particle_forward = environment.get(x + this.flow_direction, y);
            let particle_backward = environment.get(x - this.flow_direction, y);

            let can_move_forward =
                particle_forward.moveable_x &&
                particle_forward.weight < this.weight;
            let can_move_backward =
                particle_backward.moveable_x &&
                particle_backward.weight < this.weight;

            // Particle ahead cannot be moved
            if (!can_move_forward && can_move_backward) {
                // Swap direction
                this.flow_direction *= -1;

                const temp1 = particle_forward;
                particle_forward = particle_backward;
                particle_backward = temp1;

                const temp2 = can_move_forward;
                can_move_forward = can_move_backward;
                can_move_backward = temp2;
            }

            // Has space to move forward
            if (can_move_forward) {
                // Move ahead
                this.moveable_x = false;
                //environment.get(x+this.flow_direction,y).moveable_x = false;
                environment.swap(x, y, x + this.flow_direction, y);
                return [x + this.flow_direction, y];
            }
        }

        return [x, y];
    }
}
