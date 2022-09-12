import { OrganicParticle } from "../particles/organic";

export class PlantParticle extends OrganicParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#92745B";
        this.moveable = false;
        this.weight = 3;
        this.water_capacity = 200;
        this.nutrient_capacity = 200;
    }

    update(environment) {
        this.plantstuff()
    }

    plantstuff() {}
}