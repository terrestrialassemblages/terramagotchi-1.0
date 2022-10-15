import { Environment } from "./environment";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

import { FastRandom } from "./fast-random";
import {
    SoilParticle,
    WaterParticle,
} from "./particles";
import { SeedParticle } from "./particles/plants";

export class Application {
    constructor(width = 400, height = 400, instance_id, firebase_config) {
        this.width = width;
        this.height = height;
        this.instance_id = instance_id;
        this.environment = new Environment(width, height);
        this.environment.generate();

        // Initialise firebase and firestore
        this.firebase_app = initializeApp(firebase_config);
        this.db = getFirestore(this.firebase_app);
        this.create_instance = httpsCallable(getFunctions(this.firebase_app, "australia-southeast1"), "userInteract");
        this.initialize_db();
    }

    update() {
        this.environment.update()
        this.environment.refresh()
    }

    initialize_db() {
        // Initialize database varibles and start listening for changes
        this.create_instance({ document: "init", instance_id: this.instance_id }).then((result) => {
            this.db_collection = collection(this.db, this.instance_id);
            this.start_db_listener();
            console.log("Running on instance: " + this.instance_id);
        });
    }

    start_db_listener() {
        // When the database is updated, add a new 2x2 of a particle at a random location
        onSnapshot(this.db_collection, (snapshot) => {
            const [x, y] = [FastRandom.int_min_max(10, 170), FastRandom.int_min_max(160, 310)];

            // Check which document was modified
            snapshot.docChanges().forEach((change) => {
                if (change.doc.data().value != 0) {
                    if (change.doc.id == "water") {
                        this.environment.set(new WaterParticle(x, y));
                        this.environment.set(new WaterParticle(x+1, y));
                        this.environment.set(new WaterParticle(x, y+1));
                        this.environment.set(new WaterParticle(x+1, y+1));
                    }
                    if (change.doc.id == "soil") {
                        this.environment.set(new SoilParticle(x, y));
                        this.environment.set(new SoilParticle(x+1, y));
                        this.environment.set(new SoilParticle(x, y+1));
                        this.environment.set(new SoilParticle(x+1, y+1));
                    }
                    if (change.doc.id == "seed") {
                        this.environment.set(new SeedParticle(x, y));
                    }
                    if (change.doc.id == "worm") {
                        this.environment.spawn_organism(x, y);
                    }
                    if (change.doc.id == "time") {
                        this.environment.toggle_time();
                    }
                }
            });
        });
    }
}
