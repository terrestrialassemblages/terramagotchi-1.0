import { BaseParticle } from "./base";

export class OrganicParticle extends BaseParticle {
    constructor() {
        super();
        this.nutrient_level = 0;
        this.water_level = 20;
    }
}