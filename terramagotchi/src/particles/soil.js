import { OrganicParticle } from "./organic";
import { CompostParticle } from "./compost";

export class SoilParticle extends OrganicParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#92745B";
        this.moveable = true;
        this.weight = 2;

        this.water_level = (this.water_capacity/2)|0;
        this.nutrient_level = (this.nutrient_capacity/2)|0;
    }

    update(environment) {
        this.compute_gravity(environment)
        this.compute_erosion(environment)

        this.absorb_water(environment, [[0, 1], [1, 0], [0, -1], [-1, 0]], [SoilParticle]);

        this.absorb_nutrients(environment, [[0, 1], [1, 0], [0, -1], [-1, 0]], [CompostParticle, SoilParticle]);
    }
}