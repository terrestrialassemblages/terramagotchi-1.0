export class BaseParticle {
    constructor() {

        this.color = "#000000";
        this.color_variance = 0.05;

        /* Moveable: Describes whether a particle can be displaced due to any process
            Includes gravity and erosion 
            Protects plants/leaves from have heavy particles fall through */
        this.moveable = false;
        this.weight = 0;
        this.support = 4
    }

    update(x, y, grid) {}

    compute_gravity(x, y, grid) {
        this.moveable = true;
        let particle_below = grid.get(x, y-1)
        if (particle_below.moveable && this.weight > particle_below.weight) {
            particle_below.moveable = false;
            grid.swap(x, y, x, y-1);
        }
    }

    compute_erosion(x, y, grid) {}
}