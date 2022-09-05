import { InorganicParticle } from "./inorganic";

export class WaterParticle extends InorganicParticle {
    constructor() {
        super();
        this.base_color = "#5080D0"; // idk, just put in some blue
        this.moveable = true;
        this.weight = 1;
        this.water_content = 50;
        this.flow_direction = 1;
    }

    update(x, y, grid) {

        if (this.last_frame == grid.frame())
            return;

        // water flow update to go here
        this.compute_gravity(x, y, grid)
        this.computer_flow(x,y,grid)

        this.last_frame = grid.frame()
    }
}