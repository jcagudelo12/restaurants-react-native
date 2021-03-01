import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6tAO_YhqF5LblPGqzXrAJbSZ-VrbL52E",
  authDomain: "restaurants-82c13.firebaseapp.com",
  projectId: "restaurants-82c13",
  storageBucket: "restaurants-82c13.appspot.com",
  messagingSenderId: "629748694089",
  appId: "1:629748694089:web:9fe1f9a77e9346b5061398",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
