import { LiquidParticle } from "./liquid";

export class WaterParticle extends LiquidParticle {
    constructor() {
        super();
        this.base_color = "#5080D0";
        this.moveable = true;
        this.weight = 1;
        this.water_content = 50;
    }

    update(x, y, environment) {
        if (this.last_tick == environment.tick) return;

        [x, y] = this.compute_gravity(x, y, environment);
        [x, y] = this.compute_flow(x, y, environment);
        this.compute_gravity(x, y, environment);

        this.last_tick = environment.tick;
    }
}
