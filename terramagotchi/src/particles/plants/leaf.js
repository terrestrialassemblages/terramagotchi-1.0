import { AirParticle } from "..";
import {
    DeadPlantParticle,
    PlantParticleFamily
} from ".";

export class LeafParticle extends PlantParticleFamily {
    constructor(x, y, plant_dna=null) {
        super(x, y, plant_dna);

        this.max_health = 1000
        this.health = this.max_health

        this.__leaf_children = null
        this.leaf_dead = false
    }

    update(environment) {
        this.absorb_nutrients(environment, this.__neighbours, this.__living_plant_particle_types)
        this.absorb_water(environment, this.__neighbours, this.__living_plant_particle_types)
        this.generate_energy()
        this.health_update(environment)
        
        if (this.is_active &&
            this.energy >= this.activation_level &&
            this.nutrient_level >= PlantParticleFamily.MIN_HEALTHY_NUTRIENTS &&
            this.water_level >= PlantParticleFamily.MIN_HEALTHY_WATER)
            this.grow_children(environment)
    }

    select_leaf_children() {
        switch (this.dna.leaf_shape) {
            case "lavender":
                
            case "sunflower":
                if (this.__current_length == 1)
                    this.__leaf_children = [[1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [1, 0], [0, -1], [-1, 0]]
                else
                    this.__leaf_children = [this.convert_angle_to_offset(this.__current_angle)]
                break
            case "flat-top":
            default:
                this.__leaf_children = [[0, -1], [this.dna.leaf_direction, 0]]
        }
    }

    grow_children(environment) {
        if (this.__current_length >= this.dna.leaf_size) {
            this.is_active = false
            return;
        }
        if (this.__leaf_children == null)
            this.select_leaf_children()

        for (let neighbour of this.__leaf_children) {
            let [offset_x, offset_y] = neighbour
            let target_particle = environment.get(this.x+offset_x, this.y+offset_y)
            if (target_particle instanceof AirParticle || (this.dna.growth_destructive && target_particle instanceof PlantParticleFamily && !target_particle.is_active)) {
                let new_leaf = new LeafParticle(this.x+offset_x, this.y+offset_y, this.dna)
                new_leaf.__current_angle = this.convert_offset_to_base_angle(offset_x, offset_y)
                new_leaf.__current_length = this.__current_length + 1
                if (new_leaf.__current_length >= this.dna.secondary_color_length)
                    new_leaf.base_color = this.dna.secondary_color

                environment.set(new_leaf)
                
                this.energy -= this.activation_level
                break //necessary
            }
        }
    }

    health_update(environment) {
        if (this.dead) {
            this.die(environment)
        }
        this.health -= 1
        if (this.health <= 0)
            this.leaf_die(environment)
    }

    leaf_die(environment) {
        this.leaf_dead = true
        if (this.death_tick == -1)
            this.death_tick = environment.tick
        if (this.death_tick == environment.tick)
            return
        for (let [offset_x, offset_y] of this.__neighbours) {
            let target_particle = environment.get(this.x+offset_x, this.y+offset_y)
            if (target_particle instanceof LeafParticle && !target_particle.leaf_dead && this.dna.get_root() == target_particle.dna.get_root())
                target_particle.die(environment)
        }
        if (this.__current_length == 1) {
            this.is_active = true
            return;
        }
        let new_dead_plant = new DeadPlantParticle(this.x, this.y, this.dna)
        environment.set(new_dead_plant)
    }
}