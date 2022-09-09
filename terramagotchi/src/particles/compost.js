import { OrganicParticle } from "./organic";

export class CompostParticle extends OrganicParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#00FF00";
        this.moveable = true;
        this.weight = 2;
        
        this.water_level = 10
        this.nutrient_level = 20
    }

    update(environment) {
        this.compute_gravity(environment)
        this.compute_erosion(environment)
    }
}