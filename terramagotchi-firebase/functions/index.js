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
        const timestamp = Date.now();
        const uid = context.auth.uid;
        
        return colRef.doc(uid).get().then((user) => {
            let time_passed = user.exists ? timestamp - user.data().last_interaction : 5000;
            // Check if it has been 5 seconds since the user's last interaction
            if (time_passed < 5000) {
                return { message: `Please wait ${(5000 - time_passed) / 1000}s` };
            } else {
                // Update the specified variable document
                docRef.get().then((doc) => {
                    docRef.update({
                        value: doc.data().value + 1,
                    });
                });

                // Set timestamp for user
                colRef.doc(uid).set({ last_interaction: timestamp });
                return { message: `Successfully sent ${data.document} to ${data.instance_id} at ${timestamp}` };
            }
        }).catch((reason) => {
            return { message: reason.message }
        });
    });
