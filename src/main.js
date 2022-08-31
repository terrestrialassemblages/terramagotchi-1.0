import p5 from "p5";

import { Application } from "./application";

export const sketch = (s) => {

    // The initial setup function.
    s.setup = () => {
        s.createCanvas(400, 400);
    };

    // The update function.
    s.draw = () => {
        s.background(0);
    };
};

const sketchInstance = new p5(sketch);
