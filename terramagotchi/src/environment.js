import { FastRandom } from "./fast-random";
import { createNoise2D } from 'simplex-noise';

import {
    BoundaryParticle,
    StoneParticle,
    SoilParticle,
    WaterParticle,
    AirParticle,
    OrganicParticle,
    CloudParticle,
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

export const WATER_ENERGY_RATIO = 1
export const NUTRIENT_ENERGY_RATIO = 1

export class Environment {
    constructor(width, height) {
        this.__tick = 0;
        this.__particle_grid = new Array(width * height); // We store the particle grid as a 1D array for optimization.
        this.__pass_through_layer = [];

        this.width = width;
        this.height = height;
        this.organisms = [];
        this.oxygen_level = 100; // max 100
        this.temperature_level = 25; // max 100

        this.__light_level = 100; // max 100
        this.__length_of_day = 36000;
        this.time_of_day = this.__length_of_day / 2;
        this.noise2D = createNoise2D();

        // How far the river can randomly move
        this.max_river_offset = 25;
        this.river_offset = (FastRandom.random() * this.max_river_offset * 2) - this.max_river_offset;
        // Half of how wide the river is
        this.river_radius = 40;
        // How deep the river is
        this.river_depth = 25;

        // Whether clouds are allowed to currently rain
        this.is_raining = false;
        // When there are this many or more cloud particles, start raining
        this.rain_on_cloud_count = 3250;
        // When there are this many or less cloud particles, stop raining
        this.rain_until_cloud_count = 2000;
        // The number of cloud particles
        this.cloud_particle_count = 0;
    }

    get_horizon(x) {
        return 150 - this.river_depth - this.river_depth * 
        (Math.sin((Math.min(this.river_radius, Math.abs(90 - x + this.river_offset)) + this.river_radius / 2)
         * Math.PI / this.river_radius)) 
        + 16 * this.noise2D((x) / 96, 0)
        + 4 * this.noise2D((x) / 32, 1000)
        + 2 * this.noise2D((x) / 16, 2000)
        + this.noise2D((x) / 8, 3000);
    }

    generate() {

        /**
         * Populates the application environment with particles
         */
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // Set Boundary Particles
                if (x == 0 || y == 0 || x == this.width - 1 || y == this.height - 1 ) {
                    this.set(new BoundaryParticle(x, y));
                }
                // Set Soil Particles
                else if (y < this.get_horizon(x)) {
                    this.set(new SoilParticle(x, y));
                } 
                // Set Water Particles
                else if (y < 140 && Math.abs(90 - x + this.river_offset) < this.river_radius) {
                    this.set(new WaterParticle(x, y));
                }
                // Set Cloud Particles
                else if (y > this.height - FastRandom.int_min_max(35, 45) && y < this.height - 5 
                        && x >= 1 && x < this.width
                        && FastRandom.random() < 0.5
                        ) {
                    this.set(new CloudParticle(x, y, 10, this));
                } 
                // Set Air Particles
                else {
                    this.set(new AirParticle(x, y));
                }
            }
        }

        this.refresh()
    }

    update() {
        for (let i = this.__pass_through_layer.length - 1; i > -1; i--) {
            let particle = this.__pass_through_layer[i];
            if (!particle.destroyed) {
                particle.update(this);
            }
        }
        
        for (let particle of [...this.__particle_grid]) {
            if (!particle.destroyed) {
                particle.update(this);
            }
        }
        this.__tick++;

        this.compute_day_night_cycle();
        this.compute_rain();
    }

    refresh() {
        
        for (let particle of this.__particle_grid) {
            particle.refresh();
        }
        for (let particle of this.__pass_through_layer) {
            particle.refresh();
        }
    }

    get(x, y) {
        return this.__particle_grid[y * this.width + x];
    }

    set(particle) {
        // Set old particle to destroyed so it doesn't get updated.
        const destroyed_particle = this.get(particle.x, particle.y);
        if (destroyed_particle) destroyed_particle.destroy(this);

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

    pass_through(passing_particle,new_x,new_y) {
        let old_x = passing_particle.x;
        let old_y = passing_particle.y;

        // Passing_particle is not on pass_through_layer
        if (!passing_particle.passing_through) {
            // Set passing_through
            passing_particle.passing_through = true;
            // Move passing_particle to pass_through_layer
            this.__pass_through_layer.push(passing_particle)
            // Replace cell in regular layer with air
            this.__particle_grid[old_x * old_y] = new AirParticle(old_x, old_y);
        }

        // Move to new position
        passing_particle.x = new_x;
        passing_particle.y = new_y;

        if (old_x != new_x) passing_particle.moveable_x = false;
        if (old_y != new_y) passing_particle.moveable_y = false;

        // Passing_particle is now in empty particle
        if (this.get(new_x, new_y).empty) {
            // Move to regular particle layer
            this.set(passing_particle);
            passing_particle.passing_through = false;
            // Remove from __pass_through_layer
            this.__pass_through_layer.splice(this.__pass_through_layer.indexOf(passing_particle), 1);
        }
    }

    get tick() {
        return this.__tick;
    }

    get particle_grid() {
        return this.__particle_grid
    }

    compute_day_night_cycle() {
        // Elapse time of day per tick
        this.time_of_day = (this.time_of_day + 1) % this.__length_of_day;

        // Compute light level
        let normalised_midday_difference = Math.abs((this.time_of_day / this.__length_of_day) - 0.5) * 2;
        this.light_level = (-5 * normalised_midday_difference) + 3.5;
        this.light_level = Math.min(1,Math.max(0,this.light_level)) * 100;
    }

    compute_rain() {

        // Is currently raining
        if (this.is_raining) {
            // Start raining when too many cloud particles exist
            if (this.cloud_particle_count <= this.rain_until_cloud_count) {
                this.is_raining = false;
            }
        }
        // Is not currently raining
        else {
            // Stop raining when too few cloud particles exist
            if (this.cloud_particle_count >= this.rain_on_cloud_count) {
                this.is_raining = true;
            }
        }
    }

    get light_level() {
        return this.__light_level;
    }
    set light_level(_val) {
        this.__light_level = _val;
    }
}
