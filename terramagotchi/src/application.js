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
        this.environment.update()
        this.environment.refresh()
    }
}
