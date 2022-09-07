import { OrganicParticle } from "./organic";

export class SoilParticle extends OrganicParticle {
    constructor() {
        super();
        this.base_color = "#92745B "; // source: https://www.color-name.com/soil.color
        this.moveable = true;
        this.weight = 2;
        this.water_capacity = 80;

        this.flip = true // testing code
    }

    update(x, y, grid) {
        if (this.flip) {
            this.flip = false
            this.water_level = Math.floor((x/240)*170+10) // Code for testing bug pathing
            this.update_color = true
            grid.queue_push(x, y)
            return;
        }

        this.check_transfer_water(x, y, grid)
        this.check_transfer_nutrients(x, y, grid)

        // Gravity & Erosion come after as movement does not update x/y vars
        // Could apply nutrient functions to non-soil otherwise
        this.compute_gravity(x, y, grid)
        this.compute_erosion(x, y, grid)
    }

    check_transfer_water(x, y, grid) {

        /// implementation that lags
        // let neighbour_offset_arr = [[0, 1], [0, -1], [1, 0], [-1, 0]]
        // let current_grestest_water = -999
        // let current_greatest_offset = [0, 0]

        // neighbour_offset_arr.forEach(([ox, oy]) => {
        //     let current_neighbour = grid.get(x+ox, y+oy)
        //     if (current_neighbour instanceof SoilParticle && current_neighbour.water_level > current_grestest_water) {
        //         current_grestest_water = current_neighbour.water_level
        //         current_greatest_offset = [ox, oy]
        //     }
        // })

        // if (current_grestest_water != -999 && current_grestest_water > this.water_level) {
        //     let neighbour_to_absorb = grid.get(x+current_greatest_offset[0], y+current_greatest_offset[1])
        //     this.water_level += 10;
        //     neighbour_to_absorb.water_level -= 10;
        //     grid.queue_push(x, y)
        //     grid.queue_push(x+current_greatest_offset[0], y+current_greatest_offset[1])
        //     this.update_color = true
        //     neighbour_to_absorb.update_color = true
        // }

        let neighbour_offset_arr = [[0, 1], [0, -1], [1, 0], [-1, 0]]
        neighbour_offset_arr.forEach(([ox, oy]) => {
            let current_neighbour = grid.get(x+ox, y+oy)
            if (current_neighbour instanceof SoilParticle && current_neighbour.water_level > this.water_level) {
                this.water_level++;
                this.update_color = true;
                current_neighbour.water_level--;
                current_neighbour.update_color = true;
                grid.queue_push(x+ox, y+oy)
            }
        })
        if (this.update_color)
            grid.queue_push(x, y)

    }

    check_transfer_nutrients(x, y, grid) {

    }
}