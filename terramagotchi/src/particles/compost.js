import { OrganicParticle } from "./organic";
import { AirParticle } from "./air";

export class CompostParticle extends OrganicParticle {
    constructor(x, y) {
        super(x, y);

        this.base_color = "#664E00";
        this.moveable = true;
        this.weight = 2;

        this.water_level = 0;
        this.water_capacity = 0;
        this.nutrient_level = 0;
        this.nutrient_capacity = 0;

        this.nutrient_content = 1000;
        this.water_content = 0;
    }

    update(environment) {
        this.compute_gravity(environment);
        this.compute_erosion(environment);

        this.disperse_nutrients(environment);
    }

    disperse_nutrients(environment) {

        // Choose a random neighbour
        let [offset_x, offset_y] = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ][Math.floor(Math.random() * 4)];
        let random_neighbour = environment.get(
            this.x + offset_x,
            this.y + offset_y
        );

        // Attempt to disperse nutrients or water
        if (random_neighbour instanceof OrganicParticle) {
            // Attempt nutrient dispersion
            if (random_neighbour.nutrient_level < random_neighbour.nutrient_capacity) {
                // Transfer as much nutrient as possible to neighbour
                let transfer_amount = Math.min(
                    this.nutrient_content,
                    random_neighbour.nutrient_capacity -
                        random_neighbour.nutrient_level
                );
                random_neighbour.nutrient_level += Math.ceil(transfer_amount / 4);
                this.nutrient_content -= Math.ceil(transfer_amount / 4);
            }

            // Attempt water dispersion
            if (random_neighbour.water_level < random_neighbour.water_capacity) {
                // Transfer as much water as possible to neighbour
                let transfer_amount = Math.min(
                    this.water_content,
                    random_neighbour.water_capacity -
                        random_neighbour.water_level
                );
                random_neighbour.water_level += transfer_amount;
                this.water_content -= transfer_amount;
            }

            // Has transfered all nutrients and water contents
            if (this.nutrient_content == 0 && this.water_content == 0) {
                environment.set(new AirParticle(this.x, this.y));
            }
        }
    }
}
