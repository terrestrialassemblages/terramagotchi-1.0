export class BaseParticle {
    constructor() {

        this.color = "#000000";
        this.color_variance = 0.05;

        /* Moveable: Describes whether a particle can be displaced due to any process
            Includes gravity and erosion 
            Protects plants/leaves from have heavy particles fall through */
        this.moveable = false;
        this.weight = 0;
    }

    update(x, y, grid) {}

    compute_gravity(x, y, grid) {
        /**
         * Gravity update function. Moves particles down if
         *      The particle below is moveable, and
         *      The particle below has a lower weight
         * Sets moveable flag to false for both after move so particles cannot move
         * twice in one update
         */
        this.moveable = true;
        let particle_below = grid.get(x, y-1)
        if (particle_below.moveable && this.weight > particle_below.weight) {
            particle_below.moveable = false;
            this.moveable = false;
            grid.swap(x, y, x, y-1);
        }
    }

    compute_erosion(x, y, grid) {
        /**
         * Prevents single-cell hills from forming through artificial erosion
         */
        if (grid.get(x-1,y+1).weight < this.weight && grid.get(x,y+1).weight < this.weight && grid.get(x+1,y+1).weight < this.weight) {
            let free_neighbours = [0]
            if (grid.get(x-1, y).moveable && grid.get(x-1, y).weight < this.weight && grid.get(x-1, y-1).weight < this.weight)
                free_neighbours.push(-1)
            if (grid.get(x+1, y).moveable && grid.get(x+1, y).weight < this.weight && grid.get(x+1, y-1).weight < this.weight)
                free_neighbours.push(+1)
            if (free_neighbours.length > 1) {
                let offset = free_neighbours[Math.floor(Math.random()*free_neighbours.length)];
                if (offset != 0)
                    grid.swap(x, y, x+offset, y)
            }
        }
    }
}