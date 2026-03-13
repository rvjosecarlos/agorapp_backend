import firebaseAdmin from "firebase-admin";

const cuentaFirebase = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(cuentaFirebase)
});

export { firebaseAdmin };