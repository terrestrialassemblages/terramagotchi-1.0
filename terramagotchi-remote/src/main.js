import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyAR_EPf5oGeR6l0OhcUn6VUkwOcJCh2xjc",
    authDomain: "terramagotchi.firebaseapp.com",
    projectId: "terramagotchi",
    storageBucket: "terramagotchi.appspot.com",
    messagingSenderId: "983152859921",
    appId: "1:983152859921:web:0cfd2e706ed003c6484ab0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app, "australia-southeast1");
const userInteract = httpsCallable(functions, "userInteract");

// Gets the instance_id from /?id={uuid}
const instance = (new URL(document.location)).searchParams.get("id");

const water_button = document.getElementById("water-button");
water_button.addEventListener('click', () => {
    userInteract({ document: "water", instance_id: instance }).then((result) => {
        console.log(result.data.message)
    });
});

const soil_button = document.getElementById("soil-button");
soil_button.addEventListener('click', () => {
    userInteract({ document: "soil", instance_id: instance }).then((result) => {
        console.log(result.data.message)
    });
});
