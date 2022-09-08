import { OrganicParticle } from "./organic";

export class CompostParticle extends OrganicParticle {
    constructor() {
        super();
        this.base_color = "#00FF00";
        this.moveable = true;
        this.weight = 2;
        
        this.water_level = 10
        this.nutrient_level = 20
    }

    update(x, y, environment) {
        this.compute_gravity(x, y, environment)
        this.compute_erosion(x, y, environment)
    }
}