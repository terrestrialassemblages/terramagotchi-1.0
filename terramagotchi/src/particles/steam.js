import { InorganicParticle } from "./inorganic";

export class SteamParticle extends InorganicParticle {
    constructor() {
        super();
        this.color = "#D2D2D2"; // idk, just put in some blue
        this.moveable = false;
        this.weight = 0;
    }
}