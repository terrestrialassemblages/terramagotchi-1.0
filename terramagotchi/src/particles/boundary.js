import { BaseParticle } from "./base";

export class BoundaryParticle extends BaseParticle {
    constructor() {
        super();
        this.base_color = "#23D18B"; // stolen from vscode palette
        this.moveable = false;
        this.weight = 4
    }
}
