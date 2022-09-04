import { InorganicParticle } from "./inorganic";

export class WaterParticle extends InorganicParticle {
    constructor() {
        super();
        this.color = "#5080D0"; // idk, just put in some blue
        this.moveable = true;
        this.weight = 1;
        this.water_content = 50;
    }

    update(x, y, grid) {
        // water flow update to go here
        this.compute_gravity(x, y, grid)
    }
}