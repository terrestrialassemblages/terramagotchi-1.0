import { InorganicParticle } from "./inorganic";

export class AirParticle extends InorganicParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#87CEEB";
        this.color_variance = 0;
        this.moveable = true;
        this.weight = 0;
    }
}
