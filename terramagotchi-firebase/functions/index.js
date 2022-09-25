const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

// Singular cloud function for user interaction, parses document and instance_id as the parameter
exports.userInteract = functions
    .runWith({
        // Reduces cold starts by keeping 5 instances of the function "warm"
        minInstances: 5,
    })
    .region("australia-southeast1")
    .https.onCall((data, context) => {
        const colRef = admin.firestore().collection(data.instance_id);
        const docRef = colRef.doc(data.document);

        docRef.get().then((doc) => {
            docRef.update({
                value: doc.data().value + 1,
            });
        });
        
        return { message: "Sent " + data.document + " to instance " + data.instance_id}
    });
