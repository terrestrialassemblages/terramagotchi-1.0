import { PlantParticleFamily } from "./plant";

export class FlowerParticle extends PlantParticleFamily {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.base_color = "#92745B";
        this.moveable = false;
        this.weight = 3;
    }

    update(environment) {
        this.plantstuff()
    }

    plantstuff() {}
}