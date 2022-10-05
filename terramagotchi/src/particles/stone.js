import { InorganicParticle } from "./inorganic";

export class StoneParticle extends InorganicParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#d4c1ac";
        this.color_variance = 0.07;
        this.moveable = true;
        this.weight = 2;
    }

    update(environment) {
        this.compute_gravity(environment);
        this.compute_erosion(environment);
    }
}
