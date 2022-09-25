import { Environment } from "./environment";
import { initializeApp } from "firebase/app";
import { doc, setDoc, collection, getFirestore } from "firebase/firestore";
import cryptoRandomString from "crypto-random-string";

export class Application {
    constructor(width = 400, height = 400) {
        this.width = width;
        this.height = height;
        this.environment = new Environment(width, height);
        this.environment.generate();

        // Initialise firebase
        this.app = initializeApp({
            apiKey: "AIzaSyAR_EPf5oGeR6l0OhcUn6VUkwOcJCh2xjc",
            authDomain: "terramagotchi.firebaseapp.com",
            projectId: "terramagotchi",
            storageBucket: "terramagotchi.appspot.com",
            messagingSenderId: "983152859921",
            appId: "1:983152859921:web:0cfd2e706ed003c6484ab0"
        });
        this.db = getFirestore(this.app);
        this.db_collection = this.initialize_db();
    }

    update() {
        this.environment.update()
        this.environment.refresh()
    }

    initialize_db() {
        this.instance_id = cryptoRandomString({ length: 6, type: "alphanumeric" });
        setDoc(doc(this.db, this.instance_id, "water"), { value: 0 });
        setDoc(doc(this.db, this.instance_id, "soil"), { value: 0 });
        
        return collection(this.db, this.instance_id);
    }
}
