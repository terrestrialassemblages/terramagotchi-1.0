import { InorganicParticle } from "./inorganic";

export class AirParticle extends InorganicParticle {
    constructor() {
        super();
        this.base_color = "#87CEEB";
        this.color_variance = 0;
        this.moveable = true;
        this.weight = 0;
    }

    update(x, y, environment) {
        this.moveable_x = true; // important lol
        this.moveable_y = true; // important lol
    }
}
