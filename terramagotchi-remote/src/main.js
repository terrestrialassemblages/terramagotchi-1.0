import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth, signInAnonymously, RecaptchaVerifier, onAuthStateChanged } from "firebase/auth";


// Fitting to screen size
const on_resize = () => {
    document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
};

on_resize();
window.addEventListener("resize", on_resize());

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

recaptchaVerifier.render().then((widgetId) => {
    window.recaptchaWidgetId = widgetId;
});

//If a user exists, uid is set to the current user
let uid = null
onAuthStateChanged(auth, (user) => {
    if (user) {
        uid = user.uid;
    } else {
        uid = null
    }
});

// Gets the instance_id from /?id={uuid}
const instance = (new URL(document.location)).searchParams.get("id");

const particle_button_click = (type, button) => {
    if (uid !== null) {
        userInteract({ document: type, instance_id: instance }).then((result) => {
            console.log(result.data.message)
            button.setAttribute("disabled", true);
        });
        setTimeout(() => {
            button.removeAttribute("disabled");
        }, 2000);
    } else {
        recaptchaVerifier.verify();
    }
}

const water_button = document.getElementById("water-button");
water_button.addEventListener('click', () => particle_button_click("water", water_button));

const soil_button = document.getElementById("soil-button");
soil_button.addEventListener('click', () => particle_button_click("soil", soil_button));



