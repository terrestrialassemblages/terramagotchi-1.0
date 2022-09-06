import { FluidParticle } from "./fluid";

export class WaterParticle extends FluidParticle {
    constructor() {
        super();
        this.base_color = "#5080D0"; // idk, just put in some blue
        this.moveable = true;
        this.weight = 1;
        this.water_content = 50;
    }

    update(x, y, grid) {

        if (this.last_frame == grid.frame())
            return;

        this.compute_gravity(x, y, grid)
        this.compute_flow(x,y,grid)

        this.last_frame = grid.frame()
    }
}