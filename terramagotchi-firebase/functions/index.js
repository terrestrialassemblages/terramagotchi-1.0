const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const COOLDOWN_LENGTH = process.env.COOLDOWN_LENGTH;

// Singular cloud function for user interaction, parses document and instance_id as the parameter
exports.userInteract = functions
    .runWith({
        // Reduces cold starts by keeping 5 instances of the function "warm"
        minInstances: 5,
    })
    .region("australia-southeast1")
    .https.onCall((data, context) => {
        const colRef = admin.firestore().collection(data.instance_id);

        // Create a new instance if given "init" as the document param
        if (data.document === "init") {
            colRef.doc("water").set({ value: 0 });
            colRef.doc("soil").set({ value: 0 });
            colRef.doc("time").set({ value: 0 });
            colRef.doc("seed").set({ value: 0 });
            colRef.doc("worm").set({ value: 0 });

            return { message: `Successfully created instance ${data.instance_id}` }
        }

        const docRef = colRef.doc(data.document);
        const timestamp = Date.now();
        const uid = context.auth.uid;

        return colRef.doc(uid).get().then((user) => {
            let time_passed = user.exists ? timestamp - user.data().last_interaction : COOLDOWN_LENGTH;
            // Check if it has been 5 seconds since the user's last interaction
            if (time_passed < COOLDOWN_LENGTH) {
                return { message: COOLDOWN_LENGTH - time_passed }
            } else {
                // Update the specified variable document
                return docRef.get().then((doc) => {
                    if (doc.exists) {
                        docRef.update({
                            value: doc.data().value + 1,
                        });
                        // Set timestamp for user
                        colRef.doc(uid).set({ last_interaction: timestamp });
                        return { message: `Successfully sent ${data.document}` }
                    }
                    return { message: `Unknown instance: ${data.instance_id}` }
                });
            }
        }).catch((reason) => {
            return { message: reason.message }
        });
    });
