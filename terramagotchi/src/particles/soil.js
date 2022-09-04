import { OrganicParticle } from "./organic";

export class SoilParticle extends OrganicParticle {
    constructor() {
        super();
        this.base_color = "#92745B "; // source: https://www.color-name.com/soil.color
        this.has_gravity = true;
        this.weight = 2;
        this.support = 3;
        this.water_capacity = 80;
    }
}