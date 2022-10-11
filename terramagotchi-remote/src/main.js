import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth, signInAnonymously, RecaptchaVerifier, onAuthStateChanged } from "firebase/auth";
import './main.css';
import 'tw-elements';

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

// HTML elements for displaying server status
const status_text = document.getElementById("status-text");
const loading_spin = document.getElementById("loading-spin");

const hide_spin = () => { loading_spin.classList.add("visually-hidden") }
const show_spin = () => { loading_spin.classList.remove("visually-hidden") }

// Recaptcha verification setup
status_text.innerText = "Authenticating..."
loading_spin.classList.remove("visually-hidden");
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    "size": "invisible",
    "callback": (response) => {
        signInAnonymously(auth).then(() => {
            // Do something on sign in
        }).catch((err) => {
            console.error(err);
            status_text.innerText = "Error Authenticating, Please Refresh"
            hide_spin();
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
        if (uid == null) {
            uid = user.uid;
            status_text.innerText = "Successfully Authenticated!"
            hide_spin();
        }
    } else {
        uid = null;
        window.recaptchaVerifier.verify();
    }
});

// Gets the instance_id from /?id={uuid}
const id_param = (new URL(document.location)).searchParams.get("id");
const instance = id_param ? id_param : "main"; // Constant instance id for debug

// Setting Instance display text
document.getElementById("instance-text").innerText = instance;

const particle_button_click = (type) => {
    if (uid !== null) {
        userInteract({ document: type, instance_id: instance}).then((result) => {
            let message = result.data.message;
            if (typeof message == "string") {
                status_text.innerText = message.includes("time") ? "Successfully Changed Time" : message;
                hide_spin();
            } else {
                start_cooldown(message);
            }
        });
    } else {
        window.recaptchaVerifier.verify();
    }
}

// Adding listeners to each user button
const water_button = document.getElementById("water-button");
water_button.addEventListener('click', () => particle_button_click("water"));

const soil_button = document.getElementById("soil-button");
soil_button.addEventListener('click', () => particle_button_click("soil"));

const seed_button = document.getElementById("seed-button");
seed_button.addEventListener('click', () => particle_button_click("seed"));

const time_button = document.getElementById("time-button");
time_button.addEventListener('click', () => particle_button_click("time"));

// Visual cooldown display
const start_cooldown = (time) => {
    water_button.disabled = true;
    soil_button.disabled = true;
    seed_button.disabled = true;
    time_button.disabled = true;

    let curr_time = time;
    status_text.innerText = `Cooldown ${(curr_time / 1000).toFixed(1)}s`;
    show_spin();
    let timer = setInterval(function() {
        curr_time = curr_time -= 100;
        if (curr_time > 0) {
            status_text.innerText = `Cooldown ${(curr_time / 1000).toFixed(1)}s`;
        } else {
            clearInterval(timer);
            status_text.innerText = "Done!";
            water_button.disabled = false;
            soil_button.disabled = false;
            seed_button.disabled = false;
            time_button.disabled = false;
            hide_spin();
        }
    }, 100);
    return timer
}