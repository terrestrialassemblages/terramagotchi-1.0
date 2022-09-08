import { Environment } from "./environment";
import { RenderQueue } from "./render_queue";

export class Application {
    constructor(width = 400, height = 400) {
        this.width = width;
        this.height = height;
        this.render_queue = new RenderQueue();
        this.environment = new Environment(width, height, this.render_queue);
        this.environment.generate();
    }

    update() {

        // Refreshes all tick-sensitive variables on all particles before updating environment.
        for(let i = 0; i < this.width * this.height; i++) {
            this.environment.get(i).refresh();
        }

        
        // Updates each particles' positions and states.
        // Order: Bottom to Top, Left to right
        for (let x = 1; x < this.width - 1; x++) {
            for (let y = 1; y < this.height - 1; y++) {
                this.environment.get(x, y).update(x, y, this.environment);
            }
        }

        // Updates each particles' positions and states.
        // Order: Bottom to Top, Left to right
        // let x_order = Array.from({length: this.width - 2}, (_, i) => i + 1)
        // for (let i = x_order.length - 1; i > 0; i--) {
        //     const j = Math.floor(Math.random() * (i + 1));
        //     [x_order[i], x_order[j]] = [x_order[j], x_order[i]];
        // }

        //  for (let i = 0; i < x_order.length; i++) {
        //     let x = x_order[i]
        //     for (let y = 1; y < this.height - 1; y++) {
        //         this.environment.get(x, y).update(x, y, this.environment)
        //     }
        // } 

        this.environment.increment_tick();
    }
}
