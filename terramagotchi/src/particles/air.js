import { InorganicParticle } from "./inorganic";

export class AirParticle extends InorganicParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#87CEEB";
        this.color_variance = 0;
        this.moveable = true;
        this.weight = 0;
    }

    set moveable_x(_val) {}
    set moveable_y(_val) {}

    get moveable_x() {return true}
    get moveable_y() {return true}
}
