import { InorganicParticle } from "./inorganic";

export class StoneParticle extends InorganicParticle {
    constructor() {
        super();
        this.base_color = "#918E85"; // source: https://www.color-name.com/stone-grey.color
        this.color_variance = 0.07;
        this.has_gravity = true;
        this.weight = 2;
        this.support = 2
    }
}