import { Environment } from "./environment";
import { initializeApp } from "firebase/app";
import { doc, setDoc, collection, getFirestore, onSnapshot } from "firebase/firestore";

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
        this.db = getFirestore(initializeApp(firebase_config));
        this.db_collection = this.initialize_db();
    }

    update() {
        this.environment.update()
        this.environment.refresh()
    }

    initialize_db() {
        // Firestore creates a collection [instance_id] when a document is set
        setDoc(doc(this.db, this.instance_id, "water"), { value: 0 });
        setDoc(doc(this.db, this.instance_id, "soil"), { value: 0 });
        setDoc(doc(this.db, this.instance_id, "seed"), { value: 0 });
        setDoc(doc(this.db, this.instance_id, "time"), { value: 0 });
        
        return collection(this.db, this.instance_id);
    }

    start_db_listener() {
        // When the database is updated, add a new 2x2 of a particle at a random location
        onSnapshot(this.db_collection, (snapshot) => {
            const [x, y] = [FastRandom.int_min_max(10, 230), FastRandom.int_min_max(130, 220)];

            // Check which document was modified
            snapshot.docChanges().forEach((change) => {
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
                if (change.doc.id == "time" && change.doc.data().value != 0) {
                    this.environment.toggle_time();
                }
            });
        });
    }
}
