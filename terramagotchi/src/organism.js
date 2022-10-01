import { CompostParticle } from "./particles";

export class Organism {
    alive = true;
    nutrient_capacity = 300;
    water_capacity = 300;
    nutrient_level = 50;
    water_level = 50;

    x = 120;
    y = 120;
    facing;

    color = "#FFF1BE"

    constructor() {
        this.facing = Math.random() < 0.5 ? "EAST" : "WEST";
    }

    update() {
        // Check if the organism must die.
        this.alive = this.nutrient_level > 0 && this.water_level > 0;

        if (this.alive)
            // Choose a random action and execute it
            [this.move, this.consume, this.defecate][
                (Math.random() * 3) >> 0
            ]();
    }

    move() {}

    consume() {}

    defecate() {}
}
