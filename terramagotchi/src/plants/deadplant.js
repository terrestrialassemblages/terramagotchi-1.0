import { PlantConstructor } from "./plant_constructor";

export class DeadPlantParticle extends PlantConstructor {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
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