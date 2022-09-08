import { InorganicParticle } from "./inorganic";

export class StoneParticle extends InorganicParticle {
    constructor() {
        super();
        this.base_color = "#918E85";
        this.color_variance = 0.07;
        this.moveable = true;
        this.weight = 2;
    }

    update(x, y, environment) {
        [x, y] = this.compute_gravity(x, y, environment);
        this.compute_erosion(x, y, environment);
    }
}
