import { PlantConstructor } from "./plant_constructor";

export class PlantParticle extends PlantConstructor {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.base_color = "#FFFFFF";
        this.moveable = false;
        this.weight = 3;
    }

    update(environment) {
        this.plantstuff()
    }

    plantstuff() {}
}