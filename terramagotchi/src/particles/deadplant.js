import { OrganicParticle } from "./organic";

export class DeadPlantParticle extends OrganicParticle {
    nutrient_level = 100;
    water_level = 100;
    moveable = true;
    weight = 2;

    update(environment) {
        this.compute_gravity(environment)
        this.compute_erosion(environment)
    }
}
