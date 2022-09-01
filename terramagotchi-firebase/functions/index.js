const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.addWater = functions
    .region("asia-east1")
    .https.onCall((data, context) => {
        const docRef = admin
            .firestore()
            .collection("main")
            .doc("1QIFdCtX47EaoDuE3XRx");
        docRef.get().then((doc) => {
            docRef.update({
                water: doc.data().water + 1,
            });
        });
    });
