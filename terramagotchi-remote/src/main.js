import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth, signInAnonymously, RecaptchaVerifier, onAuthStateChanged } from "firebase/auth";

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
const auth = getAuth(app);
const userInteract = httpsCallable(functions, "userInteract");

// Recaptcha verification setup
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    "size": "invisible",
    "callback": (response) => {
        signInAnonymously(auth).then(() => {
            console.log("Authenticated Successfully!");
        }).catch((err) => {
            console.error(err);
        })
    }
}, auth);

window.recaptchaVerifier.render().then((widgetId) => {
    window.recaptchaWidgetId = widgetId;
});

//If a user exists, uid is set to the current user
let uid = null
onAuthStateChanged(auth, (user) => {
    if (user) {
        uid = user.uid;
    } else {
        uid = null;
    }
});

// Gets the instance_id from /?id={uuid}
const id_param = (new URL(document.location)).searchParams.get("id");
const instance = id_param ? id_param : "main"; // Constant instance id for debug

const particle_button_click = (type) => {
    if (uid !== null) {
        userInteract({ document: type, instance_id: instance}).then((result) => {
            console.log(result.data.message);
        });
    } else {
        window.recaptchaVerifier.verify();
    }
}

const water_button = document.getElementById("water-button");
water_button.addEventListener('click', () => particle_button_click("water"));

const soil_button = document.getElementById("soil-button");
soil_button.addEventListener('click', () => particle_button_click("soil"));



