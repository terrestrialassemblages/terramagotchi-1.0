import { BaseParticle } from "./base";

export class BoundaryParticle extends BaseParticle {
    constructor() {
        super();
        this.color = "#23D18B"; // stolen from vscode palette
        this.moveable = false;
        this.weight = 4
        this.support = 4
    }
}
