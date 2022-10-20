import { InorganicParticle } from "./inorganic";
import { ShootSystemParticle } from "./plants";

export class StoneParticle extends InorganicParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#918E85";
        this.moveable = true;
        this.weight = 2;
        this.pass_through_types = [ ShootSystemParticle ];

        this.color_variance = 0.07;
    }

    update(environment) {
        this.compute_gravity(environment);
        this.compute_erosion(environment);
    }
}
