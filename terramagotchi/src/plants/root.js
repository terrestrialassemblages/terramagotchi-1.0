import { PlantConstructor } from "./plant_constructor";

export class RootParticle extends PlantConstructor {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.base_color = "#000000";
        this.moveable = false;
        this.weight = 3;
    }

    update(environment) {
        this.rootstuff(environment)
    }

    rootstuff(environment) {}
}