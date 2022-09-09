import { OrganicParticle } from "./organic";

export class SoilParticle extends OrganicParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#92745B";
        this.moveable = true;
        this.weight = 2;
        this.water_capacity = 80;
    }

    update(environment) {
        this.compute_gravity(environment)
        this.compute_erosion(environment)
    }
}