const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
const colRef = admin.firestore().collection("main");

exports.addWater = functions
    .region("asia-east1")
    .https.onCall((data, context) => {
        const docRef = colRef.doc("water");
        docRef.get().then((doc) => {
            docRef.update({
                value: doc.data().value + 1,
            });
        });
    });

exports.addSoil = functions
.region("asia-east1")
.https.onCall((data, context) => {
    const docRef = colRef.doc("soil");
    docRef.get().then((doc) => {
        docRef.update({
            value: doc.data().value + 1,
        });
    });
});
