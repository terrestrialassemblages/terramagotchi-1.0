import { OrganicParticle } from "../particles/organic";

export class PlantConstructor extends OrganicParticle {
    constructor(x, y, plant_dna=null) {

        if (plant_dna == null) {
            plant_dna = new Object()
            plant_dna.test = 5
        }

        super(x, y);

        this.__dna = plant_dna
    }

    update(environment) {
        this.plantstuff()
    }

    plantstuff() {}
}