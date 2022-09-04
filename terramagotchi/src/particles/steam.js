import { InorganicParticle } from "./inorganic";

export class SteamParticle extends InorganicParticle {
    constructor() {
        super();
        this.base_color = "#D2D2D2"; // idk, just put in some blue
        this.has_gravity = false;
        this.weight = 0;
    }
}