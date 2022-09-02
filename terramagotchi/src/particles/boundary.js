import { BaseParticle } from "./base";

export class BoundaryParticle extends BaseParticle {
    constructor() {
        super();
        this.color = "#23D18B"; // stolen from vscode palette
        this.has_gravity = false;
        this.weight = 0
    }
}
