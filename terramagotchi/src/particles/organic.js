import { BaseParticle } from "./base";

export class OrganicParticle extends BaseParticle {
    constructor() {
        super();
        this.__nutrient_level = 0;
        this.__water_level = 70;
        this.update_color = true;
    }

    set water_level(level) {
        this.__water_level = level;
        this.update_color = true;
    }

    set nutrient_level(level) {
        this.__nutrient_level = level;
        this.update_color = true; // Nutrient level has no effect on colour currently
    }

    get water_level() {
        return this.__water_level;
    }

    get nutrient_level() {
        return this.__nutrient_level;
    }

    get_color(s) {
        // If the colour needs updating, decrease brightness by water_level
        if (this.update_color) {
            // Initialise colour if needed
            if (this.color === "#000000") {
                super.get_color(s);
            }
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