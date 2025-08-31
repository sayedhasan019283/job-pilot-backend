import admin from 'firebase-admin';
import path from 'path';

// Initialize Firebase Admin SDK
const serviceAccount = require(path.resolve(__dirname, '../../firebase-adminsdk.json'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;
