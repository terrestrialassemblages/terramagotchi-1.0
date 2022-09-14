import { PlantConstructor } from "./plant_constructor";
import { SoilParticle } from "../particles/soil";


export class RootParticle extends PlantConstructor {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);
        this.base_color = "#000000";
        this.moveable = false;
        this.weight = 3;
    }

    update(environment) {
        this.absorb_nutrients(environment, [SoilParticle])
        this.absorb_water(environment, [SoilParticle])
    }

    rootstuff(environment) {}
}