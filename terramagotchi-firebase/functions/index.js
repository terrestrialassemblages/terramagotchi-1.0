const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

// Fallback user cooldown length in ms if no Firestore global variable is set
const DEFAULT_COOLDOWN_LENGTH = 1000;

/**
 * Firestore cloud function for handling all user interaction.
 * Requires a POST containing a json object that specifies a document and instance id.
 * Use "init" as the document to create an instance of given id.
 * 
 * Global Variables can be set in !global/variables/ within the Firestore client.
 */
exports.userInteract = functions
    .runWith({
        // Reduces cold starts by keeping 5 instances of the function "warm"
        minInstances: 5,
    })
    .region("australia-southeast1")
    .https.onCall((data, context) => {
        const colRef = admin.firestore().collection(data.instance_id);

        // "!global" collection is used to store variables, it cannot be used as a instance id
        if (data.instance_id === "!global") {
            return { message: `Cannot use global as an instance!` }
        }

        // Create a new instance if given "init" as the document param
        if (data.document === "init") {
            colRef.doc("water").set({ value: 0 });
            colRef.doc("soil").set({ value: 0 });
            colRef.doc("time").set({ value: 0 });
            colRef.doc("seed").set({ value: 0 });
            colRef.doc("worm").set({ value: 0 });

            return { message: `Successfully created instance ${data.instance_id}` }
        }

        return admin.firestore().collection("!global").doc("variables").get().then((global) => {
            // Checks if the client is authenticated
            if (!context.auth) {
                return { message: "Please authenticate." }
            }

            const docRef = colRef.doc(data.document);
            const timestamp = Date.now();
            const uid = context.auth.uid;

            // If the global variables document doesn't exist, use default user_cooldown
            const cooldown_length = global.exists ? global.data().user_cooldown : DEFAULT_COOLDOWN_LENGTH;

            return colRef.doc(uid).get().then((user) => {
                let time_passed = user.exists ? timestamp - user.data().last_interaction : cooldown_length;
                // Check if it has been 5 seconds since the user's last interaction
                if (time_passed < cooldown_length) {
                    return { message: cooldown_length - time_passed }
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
    });
