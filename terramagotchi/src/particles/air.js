import { Particle } from "./particle";

export class AirParticle extends Particle {
    constructor() {
        super();
        this.color = "#87CEEB";
        this.weight = 0;
        this.has_gravity = false;
    }
}
