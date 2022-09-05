const MAX_WATER = 300;
const MAX_FOOD = 300;


export class Bug {
    /**
     * 
     * @param {int} x   Initial x-coordinate of bug
     * @param {int} y   Initial y-coordinate of bug
     */
    constructor(x = 50, y = 50) {
        this.x = x
        this.y = y
        this.color = "#000000"
        this.water_level = 200
        this.food_level = 200
    }

    update(grid) {
        /**
         * Basic update function for bug, checked every turn.
         */
    }

    perform_action() {
        this.water_level--;
        this.food_level--;
    }
}