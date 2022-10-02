import { InorganicParticle } from "./inorganic";
import { SoilParticle } from "./soil";

export class StoneParticle extends InorganicParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#918E85";
        this.color_variance = 0.07;
        this.moveable = true;
        this.weight = 2;
    }

    update(environment) {
        this.compute_gravity(environment);
        this.compute_erosion(environment);
    }
}
