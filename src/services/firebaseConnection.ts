
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCYmNsepaRa_FiKOFNwmgtmyQ_DTbZeaks",
    authDomain: "lucklinks-a02dc.firebaseapp.com",
    projectId: "lucklinks-a02dc",
    storageBucket: "lucklinks-a02dc.firebasestorage.app",
    messagingSenderId: "228003609509",
    appId: "1:228003609509:web:631ac4f142b517aa18864c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }