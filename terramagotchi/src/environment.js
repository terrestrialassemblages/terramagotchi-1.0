import {
    BoundaryParticle,
    StoneParticle,
    SoilParticle,
    CompostParticle,
    WaterParticle,
    AirParticle,
    OrganicParticle,
} from "./particles";

import {
    PlantParticle,
    SeedParticle,
    DeadPlantParticle,
    LeafParticle,
    DeadLeafParticle,
    FlowerParticle,
    RootParticle,
    StemParticle,
} from "./particles/plants";

export class Environment {
    constructor(width, height) {
        this.__tick = 0;
        this.__particle_grid = new Array(width * height); // We store the particle grid as a 1D array for optimization.

        this.width = width;
        this.height = height;
        this.organisms = [];
        this.light_level = 100; // max 100
        this.oxygen_level = 100; // max 100
        this.temperature_level = 25; // max 100
    }

    generate() {
        /**
         * Populates the application environment with particles
         */
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (
                    x == 0 ||
                    y == 0 ||
                    x == this.width - 1 ||
                    y == this.height - 1
                ) {
                    this.set(new BoundaryParticle(x, y));
                } else if (
                    y + Math.floor(10 * Math.sin(((x + 80) * Math.PI) / 300)) <
                    25
                ) {
                    this.set(new StoneParticle(x, y));
                } else if (
                    y +
                        Math.floor(
                            50 * Math.sin(((x + 100) * Math.PI) / 200) +
                                4 * Math.sin((x + 20) / 12)
                        ) <
                    85
                ) {
                    this.set(new SoilParticle(x, y));
                } else if (y < 100) {
                    this.set(new WaterParticle(x, y));
                } else if (y > 140 && Math.random() < 0.01) {
                    this.set(new AirParticle(x, y));
                } else {
                    this.set(new AirParticle(x, y));
                }
            }
        }
        this.set(new SeedParticle(180, 140))
        this.refresh()
    }

    update() {
        for (let particle of [...this.__particle_grid]) {
            if (!particle.destroyed) {
                particle.update(this);
            }
        }
        this.__tick++;
    }

    refresh() {
        for (let particle of this.__particle_grid) {
            particle.refresh();
        }
    }

    get(x, y) {
        return this.__particle_grid[y * this.width + x];
    }

    set(particle) {
        // Set old particle to destroyed so it doesn't get updated.
        const destroyed_particle = this.get(particle.x, particle.y);
        if (destroyed_particle) destroyed_particle.destroyed = true;

        if (destroyed_particle instanceof OrganicParticle && particle instanceof OrganicParticle) {
            particle.water_level += destroyed_particle.water_level
            particle.nutrient_level += destroyed_particle.nutrient_level
        }
        
        this.__particle_grid[particle.y * this.width + particle.x] = particle;
        particle.rerender = true;
    }

    swap(x1, y1, x2, y2) {
        const particle1 = this.get(x1, y1)
        const particle2 = this.get(x2, y2)

        particle1.x = x2
        particle1.y = y2
        particle2.x = x1
        particle2.y = y1

        this.__particle_grid[y1 * this.width + x1] = particle2
        this.__particle_grid[y2 * this.width + x2] = particle1

        if (x1 != x2) {
            particle1.moveable_x = false
            particle2.moveable_x = false
        }

        if (y1 != y2) {
            particle1.moveable_y = false
            particle2.moveable_y = false
        }

        particle1.rerender = true;
        particle2.rerender = true;
    }

    get tick() {
        return this.__tick;
    }

    get particle_grid() {
        return this.__particle_grid
    }
}
