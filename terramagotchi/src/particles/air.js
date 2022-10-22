import { InorganicParticle } from "./inorganic";

export class AirParticle extends InorganicParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#87CEEB";
        this.color_variance = 0.01;
        this.moveable = true;
        this.weight = 0;

        this.empty = true;
    }

    set moveable_x(_val) {
        /** Overriding particle setter function so AirParticle moveable is never set to false */
    }
    
    set moveable_y(_val) {
        /** Overriding particle setter function so AirParticle moveable is never set to false */
    }

    get moveable_x() {return true}
    get moveable_y() {return true}
}
