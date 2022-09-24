const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const colRef = admin.firestore().collection("main");

// Singular cloud function for user interaction, parses document as the parameter
exports.userInteract = functions
    .runWith({
        // Reduces cold starts by keeping 5 instances of the function "warm"
        minInstances: 5,
    })
    .region("australia-southeast1")
    .https.onCall((data, context) => {
        const docRef = colRef.doc(data.document);
        docRef.get().then((doc) => {
            docRef.update({
                value: doc.data().value + 1,
            });
        }).catch((error) => {
            return error.message
        });

        return { message: "Successfully updated " + data.document }
    });
