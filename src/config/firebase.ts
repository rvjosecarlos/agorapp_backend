import firebaseAdmin from "firebase-admin";

const cuentaFirebase = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const appFirebase = firebaseAdmin.initializeApp({
    //credential: firebaseAdmin.credential.cert(cuentaFirebase)
    credential: firebaseAdmin.cert(cuentaFirebase)
});

export { appFirebase };