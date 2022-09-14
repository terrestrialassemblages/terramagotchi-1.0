import { SoilParticle, CompostParticle, AirParticle } from "../particles";
import { PlantConstructor } from "./plant_constructor";
import { RootParticle } from "./root";
import { PlantNodeParticle } from "./plant_node";

export class SeedParticle extends PlantConstructor {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.base_color = "#FF80FF";

        this.moveable = true;
        this.weight = 2;

        this.germinated = false
    }

    update(environment) {
        this.compute_gravity(environment)

        if (!this.germinated) {
            this.absorb_nutrients(environment, [SoilParticle, CompostParticle])
            this.absorb_water(environment, [SoilParticle, CompostParticle])
            this.check_germination_conditions(environment)
        } else {
            this.try_germinate(environment)
        }
    }

    check_germination_conditions(environment) {
        if (this.water_level >= this.activation_level && this.nutrient_level >= this.activation_level)
            this.germinated = true
    }

    try_germinate(environment) {
        if (environment.get(this.x, this.y-1) instanceof SoilParticle) {
            let new_root = new RootParticle(this.x, this.y - 1, this.dna)
            new_root.is_node = true;
            let new_plant_node = new PlantNodeParticle(this.x, this.y, this.dna)
            environment.set(new_root)
            environment.set(new_plant_node)
        }
    }
}