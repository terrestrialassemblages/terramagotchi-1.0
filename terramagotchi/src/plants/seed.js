import { PlantConstructor } from "./plant_constructor";

export class SeedParticle extends PlantConstructor {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.base_color = "#FF80FF";
        this.moveable = true;
        this.weight = 2;
        this.water_capacity = 200;
        this.nutrient_capacity = 200;
        this.color_variance = 0

        this.growth_counter = 0
    }

    update(environment) {
        this.compute_gravity(environment)
        this.check_growth_conditions(environment)
    }

    check_growth_conditions(environment) {}
}