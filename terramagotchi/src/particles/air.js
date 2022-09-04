import { InorganicParticle } from "./inorganic";

export class AirParticle extends InorganicParticle {
    constructor() {
        super();
        this.color = "#87CEEB";
        this.color_variance = 0;
        this.moveable = true;
        this.weight = 0;
    }
}
