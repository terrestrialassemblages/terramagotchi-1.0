import { ShootSystemParticle } from ".";
import { OrganicParticle } from "../organic";
import { StemParticle, BarkParticle, LeafParticle } from ".";

export class DeadPlantParticle extends OrganicParticle {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        
        this.base_color = "#8D5D4F";
        this.pass_through_types = [ StemParticle, BarkParticle, LeafParticle ];
    }

    update(environment) {
        this.compute_gravity(environment)
        this.compute_erosion(environment)
    }

}