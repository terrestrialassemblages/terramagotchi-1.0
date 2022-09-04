import {
    BoundaryParticle,
    StoneParticle,
    SoilParticle,
    WaterParticle,
    AirParticle,
} from "./particles";
import { ParticleGrid } from "./particle_grid";
import { RenderQueue } from "./render_queue";


// Global constants to limit particle processes
const THERMAL_TRANSFER_MINIMUM = 20; // minimum temperature for water/nutrient to transfer between soil particles

export class Application {
    constructor(width = 400, height = 400) {
        this.width = width;
        this.height = height;

        this.render_queue = new RenderQueue();
        this.grid = new ParticleGrid(width, height, this.render_queue);
        this.organisms = [];

        // Environment variables
        this.light_level = 100;
        this.oxygen_level = 100;
        this.temperature_level = 25; // max 100
    }

    generate() {
        /**
         * Populates the application grid with particles
         */

        // for (let y = 0; y < this.height; y++) {
        //     for (let x = 0; x < this.width; x++) {
        //         if (x == 0 || y == 0 || x == this.width - 1 || y == this.height - 1) {
        //             this.grid.set(x, y, new BoundaryParticle());
        //         } else if (Math.random() < 0.01) {
        //             this.grid.set(x, y, new StoneParticle());
        //         }
        //     }
        // }
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (
                    x == 0 ||
                    y == 0 ||
                    x == this.width - 1 ||
                    y == this.height - 1
                ) {
                    this.grid.set(x, y, new BoundaryParticle());
                } else if (
                    y + Math.floor(10 * Math.sin(((x + 80) * Math.PI) / 300)) <
                    25
                ) {
                    this.grid.set(x, y, new StoneParticle());
                } else if (
                    y +
                        Math.floor(
                            24 * Math.sin(((x - 50) * Math.PI) / 200) +
                                2 * Math.sin(x / 8)
                        ) <
                    85
                ) {
                    this.grid.set(x, y, new SoilParticle());
                } else if (y < 90) {
                    this.grid.set(x, y, new WaterParticle());
                } else if (y > 140 && Math.random() < 0.01) {
                    this.grid.set(x, y, new AirParticle());
                } else {
                    this.grid.set(x, y, new AirParticle());
                }
            }
        }
    }

    update() {
        /**
         * Calls update function inside each particle to generate next grid state.
         */
        for (let x = 1; x < this.width - 1; x++) {
            for (let y = 1; y < this.height - 1; y++) {
                this.grid.get(x, y).update(x, y, this.grid)
            }
        }
    }

    gravity_update() {
        /**
         * Deprecated function, to be moved
         */
        for (let x = 1; x < this.width - 1; x++) {
            let y = 0;
            while (++y < this.height - 2) {
                if (this.grid.get(x, y + 1).moveable) {
                    if (
                        this.grid.get(x, y).weight <
                        this.grid.get(x, y + 1).weight
                    ) {
                        if (this.grid.get(x, y).moveable) {
                            this.grid.swap(x, y, x, ++y);
                        }
                    } else {
                        // Code for erosion
                        if (
                            this.grid.get(x, y + 2).weight <
                            this.grid.get(x, y + 1).weight
                        ) {
                            let support_count =
                                1 +
                                (this.grid.get(x - 1, y).weight >=
                                    this.grid.get(x, y + 1).weight) +
                                (this.grid.get(x + 1, y).weight >=
                                    this.grid.get(x, y + 1).weight);
                            if (
                                Math.random() <
                                    (this.temperature_level / 100) ** 2 && // temperature dependence, squared cos probability is lame
                                support_count < this.grid.get(x, y + 1).support
                            ) {
                                if (
                                    this.grid.get(x - 1, y + 1).weight <
                                        this.grid.get(x, y + 1).weight &&
                                    this.grid.get(x + 1, y + 1).weight <
                                        this.grid.get(x, y + 1).weight
                                ) {
                                    if (Math.random() < 0.5) {
                                        this.grid.swap(x, y + 1, x - 1, y + 2);
                                    } else {
                                        this.grid.swap(x, y + 1, x + 1, y + 2);
                                    }
                                } else {
                                    if (
                                        this.grid.get(x - 1, y + 1).weight <
                                        this.grid.get(x, y + 1).weight
                                    )
                                        this.grid.swap(x, y + 1, x - 1, y + 2);
                                    if (
                                        this.grid.get(x + 1, y + 1).weight <
                                        this.grid.get(x, y + 1).weight
                                    )
                                        this.grid.swap(x, y + 1, x + 1, y + 2);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    computer_interactions() {
        /**
         * Deprecated function, to be removed
         */
        let transfer_threshold = (this.temperature_level - THERMAL_TRANSFER_MINIMUM) / (100 - THERMAL_TRANSFER_MINIMUM)
        for (let x = 1; x < this.width - 1; x++) {
            for (let y = 1; y < this.height - 1; y++) {
                // Limiting water/nutrient convection depending on environmental temperature
                if (Math.random() >= transfer_threshold)
                    continue;
                let target_particle = this.grid.get(x, y);
                switch (target_particle.constructor.name) {
                    case "SoilParticle":
                        // blatant thievery of water from neighbours
                        if (this.grid.get(x,y+1) instanceof SoilParticle && this.grid.get(x,y+1).water_level > target_particle.water_level) {
                            target_particle.water_level++;
                            this.grid.get(x,y+1).water_level--;
                        }
                        if (this.grid.get(x,y-1) instanceof SoilParticle && this.grid.get(x,y-1).water_level > target_particle.water_level) {
                            target_particle.water_level++;
                            this.grid.get(x,y+1).water_level--;
                        }
                        if (this.grid.get(x+1,y) instanceof SoilParticle && this.grid.get(x+1,y).water_level > target_particle.water_level) {
                            target_particle.water_level++;
                            this.grid.get(x+1,y).water_level--;
                        }
                        if (this.grid.get(x-1,y) instanceof SoilParticle && this.grid.get(x-1,y).water_level > target_particle.water_level) {
                            target_particle.water_level++;
                            this.grid.get(x-1,y).water_level--;
                        }
                        break;
                    
                    case "WaterParticle":
                        if (this.grid.get(x,y-1) instanceof SoilParticle && this.grid.get(x,y-1).water_level + target_particle.water_content < this.grid.get(x,y-1).water_capacity) {
                            this.grid.get(x,y-1).water_level += target_particle.water_content;
                            this.grid.set(x,y,new AirParticle());
                            this.render_queue.push(x,y-1)
                        } else if (this.grid.get(x+1,y) instanceof SoilParticle && this.grid.get(x+1,y).water_level + target_particle.water_content < this.grid.get(x+1,y).water_capacity) {
                            this.grid.get(x+1,y).water_level += target_particle.water_content;
                            this.grid.set(x,y,new AirParticle());
                            this.render_queue.push(x+1,y)
                        } else if (this.grid.get(x-1,y) instanceof SoilParticle && this.grid.get(x-1,y).water_level + target_particle.water_content < this.grid.get(x-1,y).water_capacity) {
                            this.grid.get(x-1,y).water_level += target_particle.water_content;
                            this.grid.set(x,y,new AirParticle());
                            this.render_queue.push(x-1,y)
                        }
                        break;
                }
            }
        }
    }
}
