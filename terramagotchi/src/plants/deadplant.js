import { PlantConstructor } from "./plant_constructor";

export class DeadPlantParticle extends PlantConstructor {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.base_color = "#92745B";
        this.moveable = true;
        this.weight = 2;
    }

    update(environment) {
        this.plantstuff()
    }

    plantstuff() {}
}