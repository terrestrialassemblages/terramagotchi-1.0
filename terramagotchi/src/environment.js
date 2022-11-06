import { FastRandom } from "./fast-random";
import { Organism } from "./organism";
import { createNoise2D } from 'simplex-noise';

import {
    AirParticle,
    BaseParticle,
    BoundaryParticle,
    CloudParticle,
    OrganicParticle,
    SoilParticle,
    StoneParticle,
    WaterParticle,
    SteamParticle,
} from "./particles";

import {
    DNANode,
    DeadPlantParticle,
    FlowerParticle,
    LeafParticle,
    PlantParticle,
    RootParticle,
    SeedParticle,
    StemParticle,
    generate_tree_dna,
    BarkParticle,
} from "./particles/plants";

export const NUTRIENT_ENERGY_RATIO = 1
export const WATER_ENERGY_RATIO = 1

export class Environment {
    constructor(width, height) {
        this.__tick = 0;
        this.__particle_grid = new Array(width * height); // We store the particle grid as a 1D array for optimization.
        this.__pass_through_layer = [];

        this.width = width;
        this.height = height;
        this.__organisms = [];
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
        // How high the river's surface level is
        this.river_surface_level = 140

        this.__water_added = 0; // Amount of water added to the environment
        this.__soil_added = 0; // Amount of soil added to the environment
        this.max_water_added = 1000; // Max amount of water added before environment reloads
        this.max_soil_added = 1000; // Max amount of soil added before environment reloads

        // Whether clouds are allowed to currently rain
        this.is_raining = false;
        // When there are this many or more cloud particles, start raining
        this.rain_on_cloud_count = 3250;
        // When there are this many or less cloud particles, stop raining
        this.rain_until_cloud_count = 2000;
        // The number of cloud particles
        this.cloud_particle_count = 0;
        // The noise offset which determines cloud shapes
        this.cloud_noise_offset = 0; 
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

    get organisms() {
        return this.__organisms
    }

    generate() {

        // Store the positions of all river particles touching the soil horizon
        let river_positions = []
        for (let x = (90 + this.river_offset - this.river_radius) | 0; 
             x < (90 + this.river_offset + this.river_radius) | 0; x++) { 
            if (this.get_horizon(x) < this.river_surface_level) {
                river_positions.push([x, this.get_horizon(x) | 0])
            }
        }
        
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
                    let new_soil = new SoilParticle(x, y)

                    // Set water level based on distance from river
                    for (let river_position of river_positions) { 
                        new_soil.water_level = Math.max(new_soil.water_level, new_soil.water_capacity - 
                            Math.abs(x - river_position[0]) - Math.abs(y - river_position[1]))
                    }
                    // Set nutrient level
                    new_soil.nutrient_level = (new_soil.nutrient_capacity / 20) | 0

                    this.set(new_soil);
                } 
                // Set Water Particles
                else if (y < this.river_surface_level && Math.abs(90 - x + this.river_offset) < this.river_radius) {
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

        // Add Kauri Seeds
        for (let i = 0; i < 2; i++) {
            this.user_add_seed("KAURI")
        }
        
        // Add Lavender Seeds
        for (let i = 0; i < 2; i++) {
            this.user_add_seed("LAVENDER")
        }

        // Add Sunflower Seeds
        for (let i = 0; i < 2; i++) {
            this.user_add_seed("SUNFLOWER")
        }

        // Add Worms
        for (let i = 0; i < 15; i++) {
            const x = FastRandom.int_min_max(5, this.width - 5)
            const y = FastRandom.int_min_max(5, this.get_horizon(x) - 5)
            this.spawn_organism(x, y)
        }


        this.refresh()
    }

    update() {
        // Update all particles in the pass-through layer
        for (let i = this.__pass_through_layer.length - 1; i > -1; i--) {
            let particle = this.__pass_through_layer[i];
            if (!particle.destroyed) {
                particle.update(this);
            }
        }
        
        // Update all particles in the main grid
        for (let particle of [...this.__particle_grid]) {
            if (!particle.destroyed) {
                particle.update(this);
            }
        }

        // Update all organisms
        for (let organism of this.__organisms) {
            organism.update(this);
        }

        this.__tick++;

        this.compute_day_night_cycle();
        this.compute_rain();
    }

    refresh() {
        // Refresh all once-per-tick particles on main grid
        for (let particle of this.__particle_grid) {
            particle.refresh();
        }
        // Refresh all once-per-tick particles in the pass-through layer
        for (let particle of this.__pass_through_layer) {
            particle.refresh();
        }
    }

    get(x, y) {
        return this.__particle_grid[y * this.width + x];
    }

    set(particle) {
        /**
         * Replaces a particle in the particle grid with a new particle, while handling W/N conservation and the destruction of the old particle
         * @param {BaseParticle} particle   The new particle to be inserted into the particle grid
         *                                  Destroyed particle determined by the new particles x/y coordinates
         */
        // Set old particle to destroyed so it doesn't get updated.
        const destroyed_particle = this.get(particle.x, particle.y);
        if (destroyed_particle) destroyed_particle.destroy(this);

        if (destroyed_particle instanceof BarkParticle && particle instanceof AirParticle) {
            console.log("How")
        }

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
            this.__particle_grid[old_y * this.width + old_x] = new AirParticle(old_x, old_y);
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
            // Store was_passing_through to prevent further movement
            passing_particle.was_passing_through = false;
        }
    }

    spawn_organism(x, y) {
        this.__organisms.push(new Organism(x, y, this))
    }

    get tick() {
        return this.__tick;
    }

    get particle_grid() {
        return this.__particle_grid;
    }

    compute_day_night_cycle() {
        // Elapse time of day per tick
        this.time_of_day = (this.time_of_day + 1) % this.__length_of_day;

        // Compute light level
        let normalised_midday_difference = Math.abs((this.time_of_day / this.__length_of_day) - 0.5) * 2;
        this.light_level = (-5 * normalised_midday_difference) + 3.5;
        this.light_level = Math.min(1,Math.max(0,this.light_level)) * 100;
    }

    // Changes time_of_day to next visual light change
    change_time() {
        // Night, change to Dawn
        if (this.time_of_day < (0.15 * this.__length_of_day) || this.time_of_day > (0.85 * this.__length_of_day)) {
            this.time_of_day = 0.20 * this.__length_of_day;
        // Dawn, change to Day
        } else if (this.time_of_day >= (0.15 * this.__length_of_day) && this.time_of_day < (0.25 * this.__length_of_day)) {
            this.time_of_day = 0.25 * this.__length_of_day;
        // Day, change to Dusk
        } else if (this.time_of_day >= (0.25 * this.__length_of_day) && this.time_of_day < (0.75 * this.__length_of_day)) {
            this.time_of_day = 0.80 * this.__length_of_day;
        // Dusk, change to Night
        } else if (this.time_of_day >= (0.75 * this.__length_of_day) && this.time_of_day < (0.85 * this.__length_of_day)) {
            this.time_of_day = 0.85 * this.__length_of_day;
        }
    }

    // Creates a 4x4 with of the given particle at a random valid position (for user interaction purposes)
    user_add_particle(particle) {
        // x, y position is random within bounds and above land
        const [x, y] = [FastRandom.int_min_max(1, this.width - 5), FastRandom.int_min_max(160, this.height - 5)];
        let added_particles = 0

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                // Checks that the particle being replaced is Air, Cloud or Steam
                if (this.get(x + i, y + j) instanceof (AirParticle || CloudParticle || SteamParticle)) {
                    if (particle === WaterParticle) {
                        // Create water particle with water_level = 100
                        this.set(new particle(x + i, y + j, 100));
                        this.water_added += 1;
                    } else {
                        this.set(new particle(x + i, y + j)); 
                    }
                    added_particles++;

                    // Increases soil tracking variable
                    if (particle === SoilParticle) { this.soil_added += 1; }
                }
            }
        }
        // If no particles were added, try again in a new location
        if (added_particles === 0) {
            this.user_add_particle(particle);
        }
    }

    // Creates a seed with of the given plant at a random valid position (for user interaction purposes)
    user_add_seed(plant) {
        // x, y position is random within bounds and above land
        const y = FastRandom.int_min_max(160, this.height - 1);
        let x = 0;
        // Generates an x value which is likely to be on either side of the river.
        if (FastRandom.random() >= 0.5) {
            x = FastRandom.int_min_max(Math.ceil(this.width / 2 + this.river_offset + this.river_radius - 10), this.width - 1);
        } else {
            x = FastRandom.int_min_max(1, Math.floor(this.width / 2 + this.river_offset - this.river_radius + 10));
        }
        
        // Checks that the particle being replaced is Air, Cloud or Steam
        if (this.get(x, y) instanceof (AirParticle || CloudParticle || SteamParticle)) {
            this.set(new SeedParticle(x, y, new DNANode(null, generate_tree_dna(plant))))
        } else {
            // If no particles were added, try again in a new location
            this.user_add_seed(plant);
        }
    }

    get water_added() {
        return this.__water_added;
    }

    set water_added(_val) {
        // Reloads page if added soil value is at or above max
        if (_val >= this.max_water_added) { location.reload() }
        this.__water_added = _val;
    }

    get soil_added() {
        return this.__soil_added;
    }

    set soil_added(_val) {
        // Reloads page if added soil value is at or above max
        if (_val >= this.max_water_added) { location.reload() }
        this.__soil_added = _val;
    }

    compute_rain() {

        // Is currently raining
        if (this.is_raining) {
            // Stop raining when too few cloud particles exist
            if (this.cloud_particle_count <= this.rain_until_cloud_count) {
                this.is_raining = false;

                // Randomise cloud shapes
                this.cloud_noise_offset = FastRandom.int_max(1000)
            }
        }
        // Is not currently raining
        else {
            // Start raining when too many cloud particles exist
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
