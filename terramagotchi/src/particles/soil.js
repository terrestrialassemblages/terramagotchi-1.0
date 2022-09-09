import { OrganicParticle } from "./organic";

export class SoilParticle extends OrganicParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#92745B";
        this.moveable = true;
        this.weight = 2;
    }

    update(environment) {
        this.compute_gravity(environment)
        this.compute_erosion(environment)

        this.absorb_water(environment, [[0, 1], [0, 1], [1, 0], [0, -1], [-1, 0]]);
        //this.absorb_water(environment, [[0, 1], [1, 0], [0, -1], [-1, 0]]);
    }
}