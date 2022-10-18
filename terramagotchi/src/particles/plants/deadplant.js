import { ShootSystemParticle } from ".";
import { OrganicParticle } from "../organic";

export class DeadPlantParticle extends OrganicParticle {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.base_color = "#8D5D4F";
        this.moveable = true;
        this.weight = 2;
    }

    update(environment) {
        this.compute_gravity(environment)
    }

}