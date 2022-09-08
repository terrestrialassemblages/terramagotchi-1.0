import { OrganicParticle } from "./organic";

export class SoilParticle extends OrganicParticle {
    constructor() {
        super();
        this.base_color = "#92745B";
        this.moveable = true;
        this.weight = 2;
        this.water_capacity = 80;
    }

    update(x, y, environment) {
        this.compute_gravity(x, y, environment)
        this.compute_erosion(x, y, environment)
    }
}