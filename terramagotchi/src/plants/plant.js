import { PlantConstructor } from "./plant_constructor";

export class PlantParticle extends PlantConstructor {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
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