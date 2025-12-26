
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { APP_CONFIG } from "../config";

// Only initialize if we are in PROD mode or if config exists, 
// otherwise we risk crashing the app in Test mode if keys are missing.
let app;
let db: any;
let auth: any;
let storage: any;

if (APP_CONFIG.mode === 'PROD') {
    try {
        app = initializeApp(APP_CONFIG.firebase);
        db = getFirestore(app);
        auth = getAuth(app);
        storage = getStorage(app);
        console.log("Firebase Initialized in PROD Mode");
    } catch (e) {
        console.error("Firebase Initialization Failed. Check your config.ts.", e);
    }
}

export { db, auth, storage };
