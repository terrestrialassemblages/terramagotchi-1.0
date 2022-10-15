import { BaseParticle } from "./base";

export class BoundaryParticle extends BaseParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#000";
        this.color_variance = 0;
        this.moveable = false;
        this.weight = 4
    }
}
