import { OrganicParticle } from "./organic";
import { CompostParticle } from "./compost";

export class SoilParticle extends OrganicParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#92745B";

        this.water_level = 30;
        this.nutrient_level = 30;
    }

    update(environment) {
        this.compute_gravity(environment)
        this.compute_erosion(environment)

        this.absorb_water(environment, [[0, 1], [1, 0], [0, -1], [-1, 0]], [SoilParticle]);

        this.absorb_nutrients(environment, [[0, 1], [1, 0], [0, -1], [-1, 0]], [CompostParticle, SoilParticle]);
    }
}