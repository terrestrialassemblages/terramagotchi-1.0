export class BaseParticle {
    constructor() {
        this.color = "#000000";
        this.color_variance = 0.05;
        this.has_gravity = true;
        this.weight = 0;
        this.support = 4
    }

    update(x, y, grid) {
        
    }
}
