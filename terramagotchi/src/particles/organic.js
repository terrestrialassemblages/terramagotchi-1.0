import { BaseParticle } from "./base";

export class OrganicParticle extends BaseParticle {
    constructor() {
        super();
        this.nutrient_level = 0;
        this.water_level = 20;
    }

    get_color(s) {
        // If the colour needs updating and is initialised, decrease brightness by water_level
        if (this.update_color && this.color !== "#000000") {
            this.color = s.color(
                s.hue(this.color),
                s.saturation(this.color),
                s.brightness(this.base_color) * this.brightness_offset - this.water_level / 6
            )
            this.update_color = false;
        } else {
            super.get_color(s);
        }
        return this.color;
    }
}