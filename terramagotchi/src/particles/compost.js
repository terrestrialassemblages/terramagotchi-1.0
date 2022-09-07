import { OrganicParticle } from "./organic";

export class CompostParticle extends OrganicParticle {
    constructor() {
        super();
        this.base_color = "#00FF00 "; // source: https://www.color-name.com/soil.color
        this.moveable = true;
        this.weight = 2;
        
        this.water_level = 10
        this.nutrient_level = 20
    }

    update(x, y, grid) {
        this.compute_gravity(x, y, grid)
        this.compute_erosion(x, y, grid)
    }
}