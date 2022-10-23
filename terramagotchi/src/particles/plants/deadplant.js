import { ShootSystemParticle } from ".";
import { OrganicParticle } from "../organic";
import { StemParticle, BarkParticle, LeafParticle } from ".";
import { FastRandom } from "../../fast-random";
import { AirParticle } from "../air";

const DESPAWN_IF_EMPTY_CHANCE = 0.1

export class DeadPlantParticle extends OrganicParticle {
    /**
     * @param {Number}  x           (Integer) x-coordinate of particle to be constructed
     * @param {Number}  y           (Integer) y-coordinate of particle to be constructed
     * @param {DNANode} plant_dna   The DNA-node object for this plant particle. Represents a node in a tree graph.
     */
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        
        this.base_color = "#8D5D4F";
        this.pass_through_types = [ StemParticle, BarkParticle, LeafParticle ];

        this.can_erode = true;
    }

    /**
     * Handles update function for the deadplant particle
     * @param {Environment} environment     The current game environment
     */
    update(environment) {
        // Toggle erosion to false after entering the pass-through layer
        if (this.can_erode && this.passing_through) this.can_erode = false;
        // Toggle erosion to true after hovering above an empty particle
        if (!this.can_erode && environment.get(this.x, this.y - 1).empty) this.can_erode = true;

        if (this.can_erode) this.compute_erosion(environment)
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