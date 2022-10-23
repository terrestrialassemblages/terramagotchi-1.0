// import { PlantFamilyParticle } from "./plant";
import { LeafParticle } from "./leaf";

export class FlowerParticle extends LeafParticle {
    /**
     * @param {Number}  x           (Integer) x-coordinate of particle to be constructed
     * @param {Number}  y           (Integer) y-coordinate of particle to be constructed
     * @param {DNANode} plant_dna   The DNA-node object for this plant particle. Represents a node in a tree graph.
     */
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);

        this.nutrient_capacity = 100
        this.water_capacity = 100
    }
}