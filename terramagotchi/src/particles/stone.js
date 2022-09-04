import { InorganicParticle } from "./inorganic";

export class StoneParticle extends InorganicParticle {
    constructor() {
        super();
        this.color = "#918E85"; // source: https://www.color-name.com/stone-grey.color
        this.color_variance = 0.07;
        this.moveable = true;
        this.weight = 2;
    }

    update(x, y, grid) {
        this.compute_gravity(x, y, grid)
        this.compute_erosion(x, y, grid)
    }
}