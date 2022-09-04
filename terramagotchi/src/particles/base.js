export class BaseParticle {
    constructor() {

        this.color = "#000000";
        this.color_variance = 0.05;

        /* Moveable: Describes whether a particle can be displaced due to any process
            Includes gravity and erosion 
            Protects plants/leaves from have heavy particles fall through */
        this.moveable = true;
        this.weight = 0;
        this.support = 4
    }

    update(x, y, grid) {
        
    }

    compute_gravity(x, y, grid) {
        if (Math.random() < 0.0001)
            console.log("pog")
    }

    compute_erosion(x, y, grid) {}
}
