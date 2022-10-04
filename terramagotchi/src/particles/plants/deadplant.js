import { Plant } from "./plant";
import { CompostParticle } from "../particles";

export class DeadPlantParticle extends Plant {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.moveable = true;
        this.weight = 2;
        this.lifetime = 500;
    }

    update(environment) {
        this.lifetime--;
        if (this.lifetime <= 0) {
            let new_compost_particle = new CompostParticle(this.x, this.y)
            environment.set(new_compost_particle)
        }
    }

}