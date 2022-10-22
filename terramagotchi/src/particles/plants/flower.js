// import { PlantFamilyParticle } from "./plant";
import { LeafParticle } from "./leaf";

export class FlowerParticle extends LeafParticle {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);

        this.nutrient_capacity = 100
        this.water_capacity = 100
    }
}