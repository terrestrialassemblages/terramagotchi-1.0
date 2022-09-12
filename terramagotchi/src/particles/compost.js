import { OrganicParticle } from "./organic";
import { AirParticle } from "./air";

export class CompostParticle extends OrganicParticle {
    constructor(x, y) {
        super(x, y);
        this.base_color = "#00FF00";
        this.moveable = true;
        this.weight = 2;
        
        this.water_level = 0
        this.water_capacity = 0
        this.nutrient_level = 0
        this.nutrient_capacity = 0

        this.nutrient_content = 100
    }

    update(environment) {
        this.compute_gravity(environment);
        this.compute_erosion(environment);

        this.disperse_nutrients(environment);
    }

    disperse_nutrients(environment) {

        // Someone plz replace with proper Poisson Distribution stuff
        if (Math.random() > 0.001) {
            return;
        }

        // Choose a random neighbour
        let [offset_x, offset_y] = [[0, 1], [1, 0], [0, -1], [-1, 0]][Math.random()*4 >> 0];
        let random_neighbour = environment.get(this.x + offset_x, this.y + offset_y);

        // Attempt to disperse nutrient to random organic neighbour
        if (random_neighbour instanceof OrganicParticle && random_neighbour.nutrient_level < random_neighbour.nutrient_capacity) {
            // Transfer as much nutrient as possible to neighbour
            let transfer_amount = Math.min(this.nutrient_content, random_neighbour.nutrient_capacity - random_neighbour.nutrient_level)
            random_neighbour.nutrient_level += transfer_amount;
            this.nutrient_content -= transfer_amount;

            // Nutrient has transfered as much as it can
            if (this.nutrient_content == 0) {
                let new_air_particle = new AirParticle(this.x, this.y);
                environment.set(new_air_particle);
            }
        }
    }
}