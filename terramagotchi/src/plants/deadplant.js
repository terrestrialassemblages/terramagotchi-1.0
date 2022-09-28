import { Plant } from "./plant";

export class DeadPlantParticle extends Plant {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.base_color = "#92745B";
        this.moveable = true;
        this.weight = 2;
        this.lifetime = 500;
    }

    update(environment) {
        this.lifetime--;
        if (this.lifetime <= 0) {
            let new_compost_particle = new CompostParticle(this.x, this.y)
            new_compost_particle.nutrient_level = this.nutrient_level;
            new_compost_particle.water_level = this.water_level;
            environment.set(new_compost_particle)
        }
    }

}