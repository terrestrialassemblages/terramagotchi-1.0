import { Environment } from "./environment";

export class Application {
    constructor(width = 400, height = 400) {
        this.width = width;
        this.height = height;
        this.environment = new Environment(width, height);
        this.environment.generate();
    }

    update() {
        this.environment.update()
        this.environment.refresh()
    }
}
