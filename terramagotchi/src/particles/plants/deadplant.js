import { ShootSystemParticle } from ".";
import { OrganicParticle } from "../organic";
import { StemParticle, BarkParticle, LeafParticle } from ".";
import { FastRandom } from "../../fast-random";
import { AirParticle } from "../air";

const DESPAWN_IF_EMPTY_CHANCE = 0.1

export class DeadPlantParticle extends OrganicParticle {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        
        this.base_color = "#8D5D4F";
        this.pass_through_types = [ StemParticle, BarkParticle, LeafParticle ];
    }

    update(environment) {
        this.compute_erosion(environment)
        this.compute_gravity(environment)

        if (
            this.water_level == 0 &&
            this.nutrient_level == 0 &&
            FastRandom.random() < DESPAWN_IF_EMPTY_CHANCE
        ) {
            environment.set(new AirParticle(this.x, this.y))
        }
    }

}