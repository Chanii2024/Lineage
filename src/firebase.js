import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase configuration placeholders
// IMPORTANT: Please replace these with your actual Firebase project settings.
const firebaseConfig = {
    apiKey: "AIzaSyAQI8LnuX7WDpydFhxLvByom-vAVO0DPts",
    authDomain: "lineage-app-host.firebaseapp.com",
    projectId: "lineage-app-host",
    storageBucket: "lineage-app-host.firebasestorage.app",
    messagingSenderId: "1006601237349",
    appId: "1:1006601237349:web:bdef9b3fef6b754da8e78c",
    databaseURL: "https://lineage-app-host-default-rtdb.asia-southeast1.firebasedatabase.app"
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
