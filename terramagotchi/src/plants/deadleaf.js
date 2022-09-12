import { OrganicParticle } from "../particles/organic";

export class DeadLeafParticle extends OrganicParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#92745B";
        this.moveable = true;
        this.weight = 2;
        this.water_capacity = 200;
        this.nutrient_capacity = 200;
    }

    update(environment) {
        this.plantstuff()
    }

    plantstuff() {}
}