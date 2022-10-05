import { SoilParticle, CompostParticle, AirParticle } from "..";
import { PlantParticleFamily } from "./plant";
import { RootParticle } from "./root";
import { StemParticle } from "./stem";

export class SeedParticle extends PlantParticleFamily {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.base_color = "#FF80FF";

        this.moveable = true;
        this.weight = 2;

        this.germinated = false
    }

    update(environment) {
        this.compute_gravity(environment)
        this.absorb_nutrients(environment, this.__neighbours, [SoilParticle, CompostParticle])
        this.absorb_water(environment, this.__neighbours, [SoilParticle, CompostParticle])
        
        if (!this.germinated)
            if (this.water_level >= this.activation_level && this.nutrient_level >= this.activation_level)
                this.germinated = true
        
        // Separated out so plant gros
        if (this.germinated)
            this.grow(environment)
    }

    grow(environment) {
        if (environment.get(this.x, this.y-1) instanceof SoilParticle) {
            let new_stem_cell = new StemParticle(this.x, this.y, this.dna)
            environment.set(new_stem_cell)

            let new_root = new RootParticle(this.x, this.y-1, this.dna)
            environment.set(new_root)
        }
    }
}