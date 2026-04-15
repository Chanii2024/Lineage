import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase configuration placeholders
// IMPORTANT: Please replace these with your actual Firebase project settings.
const firebaseConfig = {
    apiKey: "AIzaSyBSqETiukoiwa6CLg2D0AiTXR78MCsV6uk",
    authDomain: "lineage-family.firebaseapp.com",
    projectId: "lineage-family",
    storageBucket: "lineage-family.firebasestorage.app",
    messagingSenderId: "83404397233",
    appId: "1:83404397233:web:ab26e4c94bfda03b79a090"
};

let database;
try {
    // Initialize Firebase only if the config is not placeholders
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        const app = initializeApp(firebaseConfig);
        database = getDatabase(app);
    } else {
        console.warn("Lineage: Using placeholder Firebase config. Real-time sync will not work.");
        database = null;
    }
} catch (error) {
    console.error("Lineage: Fatal Firebase initialization failure. Real-time protocols disabled.", error);
    database = null;
}


export { database };
