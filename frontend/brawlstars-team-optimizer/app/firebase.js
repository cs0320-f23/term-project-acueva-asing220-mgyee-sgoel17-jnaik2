import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";

const firebaseConfig = {};

const app = initializeApp(firebaseConfig);
// firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);
const auth = getAuth(app);
// export default app;
export { auth, db };
