import { BaseParticle } from "./base";

export class LiquidParticle extends BaseParticle {
    constructor() {
        super();
        this.flow_direction = 1;
    }

    compute_flow(x, y, grid) {
        let particle_infront = grid.get(x+this.flow_direction,y);
        let particle_behind = grid.get(x-this.flow_direction,y);

        let can_move_infront = particle_infront.moveable && particle_infront.weight < this.weight;
        let can_move_behind = particle_behind.moveable && particle_behind.weight < this.weight;

        // Particle ahead cannot be moved
        if (!can_move_infront && can_move_behind) {
            // Swap direction
            this.flow_direction *= -1;

            let temp1 = particle_infront;
            particle_infront = particle_behind;
            particle_behind = temp1;

            let temp2 = can_move_infront;
            can_move_infront = can_move_behind;
            can_move_behind = temp2;
        }

        // Has space to move infront
        if (can_move_infront) {
            // Move ahead
            grid.swap(x,y,x+this.flow_direction,y);
            // Reattempt gravity after flowing
            if (this.moveable)
                this.compute_gravity(x+this.flow_direction, y, grid);
        }
    }
}