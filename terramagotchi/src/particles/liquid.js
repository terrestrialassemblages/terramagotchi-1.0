import { BaseParticle } from "./base";

export class LiquidParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y);
        this.flow_direction = 1;
    }

    compute_flow(environment) {
        // Can move horizontally and vertically this tick, and isn't above a ligher particle.
        if (
            this.moveable_x &&
            this.moveable_y &&
            environment.get(this.x, this.y - 1).weight >= this.weight
        ) {
            let particle_forward = environment.get(
                this.x + this.flow_direction,
                this.y
            );
            let particle_backward = environment.get(
                this.x - this.flow_direction,
                this.y
            );

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
                environment.swap(
                    this.x,
                    this.y,
                    this.x + this.flow_direction,
                    this.y
                );
            }
        }
    }
}
