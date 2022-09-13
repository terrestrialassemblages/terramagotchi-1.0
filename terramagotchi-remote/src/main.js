// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
// https://firebase.google.com/docs/web/setup#available-libraries

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
const functions = getFunctions(app, "asia-east1");

// Function for incrementing the firestore water value by 1
const addWater = httpsCallable(functions, "addWater");
const water_button = document.getElementById("water-button");
water_button.addEventListener('click', () => {
    addWater();
});

// Function for incrementing the firestore dirt value by 1
const addSoil = httpsCallable(functions, "addSoil");
const dirt_button = document.getElementById("soil-button");
dirt_button.addEventListener('click', () => {
    addSoil();
});