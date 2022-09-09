import { LiquidParticle } from "./liquid";

export class WaterParticle extends LiquidParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#5080D0";
        this.moveable = true;
        this.weight = 1;
        this.water_content = 50;
    }

    update(environment) {
        if (this.last_tick == environment.tick) return;

        this.compute_gravity(environment);
        this.compute_flow(environment);
        this.compute_gravity(environment);

        this.last_tick = environment.tick;
    }
}
