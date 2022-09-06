import { GasParticle } from "./gas";
import { WaterParticle } from "./water";

export class SteamParticle extends GasParticle {
    constructor() {
        super();
        this.base_color = "#DDDDDD"; // idk, just put in some grey
        this.moveable = true;
        this.weight = 0;
        this.condensation_time = 600; // How many frames until the steam turns into water

        // Initial values used to slow down horizontal movement based on time
        this.initial_condensation_time = this.condensation_time
        this.initial_horizontal_movement_probability = this.horizontal_movement_probability
    }

    update(x, y, grid) {

        if (this.last_tick == grid.tick)
            return;

        // Countdown condensation time
        this.condensation_time--
        // Slow down horizontal movement when closer to condensation
        this.horizontal_movement_probability = this.condensation_time / this.initial_condensation_time * this.initial_horizontal_movement_probability;

        // Turn steam into water
        if (this.condensation_time <= 0) {
            grid.set(x,y,new WaterParticle());
            return;
        }

        // Rise steam as a Gas Particle
        this.compute_rise(x,y,grid);

        this.last_tick = grid.tick;
    }
}