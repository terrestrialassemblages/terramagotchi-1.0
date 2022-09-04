import { OrganicParticle } from "./organic";

export class SoilParticle extends OrganicParticle {
    constructor() {
        super();
        this.color = "#92745B "; // source: https://www.color-name.com/soil.color
        this.moveable = true;
        this.weight = 2;
        this.support = 3;

        this.water_capacity = 80;
    }

    update() {
        this.compute_erosion()
        this.compute_gravity()
    }
}