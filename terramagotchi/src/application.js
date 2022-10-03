import { Environment } from "./environment";
import { initializeApp } from "firebase/app";
import { doc, setDoc, collection, getFirestore, onSnapshot } from "firebase/firestore";

import {
    SoilParticle,
    WaterParticle,
} from "./particles";

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAR_EPf5oGeR6l0OhcUn6VUkwOcJCh2xjc",
    authDomain: "terramagotchi.firebaseapp.com",
    projectId: "terramagotchi",
    storageBucket: "terramagotchi.appspot.com",
    messagingSenderId: "983152859921",
    appId: "1:983152859921:web:0cfd2e706ed003c6484ab0"
};

export class Application {
    constructor(width = 400, height = 400, instance_id) {
        this.width = width;
        this.height = height;
        this.instance_id = instance_id;
        this.environment = new Environment(width, height);
        this.environment.generate();

        // Initialise firebase and firestore
        this.db = getFirestore(initializeApp(FIREBASE_CONFIG));
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
        
        return collection(this.db, this.instance_id);
    }

    start_db_listener() {
        // When the database is updated, add a new 2x2 of a particle at a random location
        onSnapshot(this.db_collection, (snapshot) => {
            const [x, y] = [Math.floor(Math.random() * (230 - 10) + 10), Math.floor(Math.random() * (220 - 130) + 130)];

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
            });
        });
    }
}
