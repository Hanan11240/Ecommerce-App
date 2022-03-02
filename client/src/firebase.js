import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCWJZUBMsvnGK9YU-5fV1k1WTZuBEBmEF8",
    authDomain: "ecommerce-challenge-9648b.firebaseapp.com",
    projectId: "ecommerce-challenge-9648b",
    storageBucket: "ecommerce-challenge-9648b.appspot.com",
    messagingSenderId: "196072182268",
    appId: "1:196072182268:web:0e2e3383167c030d60a279"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();