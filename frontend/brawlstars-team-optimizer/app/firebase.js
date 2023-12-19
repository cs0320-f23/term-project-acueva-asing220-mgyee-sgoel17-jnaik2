import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyAdeIVJ1KhgWILLIW8FvGGBH4WFeEbrxEk",
  authDomain: "cs32-final-term-project-406919.firebaseapp.com",
  projectId: "cs32-final-term-project-406919",
  storageBucket: "cs32-final-term-project-406919.appspot.com",
  messagingSenderId: "154185036352",
  appId: "1:154185036352:web:a2e6cb1a0cadfd2290a5a5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
// export const auth = getAuth(app);
export default app;
const auth = getAuth(app);
// export default app;
export { auth, db };
