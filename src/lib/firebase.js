import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics only if supported (SSR-safe)
isSupported().then((ok) => { if (ok) getAnalytics(app); });





















// // src/lib/firebase.js
// import { initializeApp, getApps } from "firebase/app";
// import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";


// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCqR1aQ03MDAYo-8EpZVdMd3oimogl_uko",
//   authDomain: "scaena-14226.firebaseapp.com",
//   projectId: "scaena-14226",
//   storageBucket: "scaena-14226.firebasestorage.app",
//   messagingSenderId: "505172536274",
//   appId: "1:505172536274:web:796f1ffadf7af7a030f60b",
//   measurementId: "G-KS36NSFR38"
// };

// const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// // Optional analytics (browser only)
// analyticsSupported().then((ok) => { if (ok) getAnalytics(app); }).catch(() => {});

// export const db = getFirestore(app);
// export const auth = getAuth(app);
// export const storage = getStorage(app);
