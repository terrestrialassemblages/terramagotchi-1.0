import { OrganicParticle } from "./organic";

export class SoilParticle extends OrganicParticle {
    constructor() {
        super();
        this.base_color = "#92745B "; // source: https://www.color-name.com/soil.color
        this.moveable = true;
        this.weight = 2;
        this.water_capacity = 80;
    }

    update(x, y, grid) {
        if (this.water_level != x) {
            this.water_level = x // Code for testing bug pathing
            grid.queue_push(x, y)
        }
        this.compute_gravity(x, y, grid)
        this.compute_erosion(x, y, grid)
    }
}