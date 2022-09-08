import { BaseParticle } from "./base";

export class BoundaryParticle extends BaseParticle {
    constructor() {
        super();
        this.base_color = "#23D18B";
        this.moveable = false;
        this.weight = 4
    }
}
