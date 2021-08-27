
// Firebase App (the core Firebase SDK) is always required and must be listed before other Firebase SDKs
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/messaging";
import "firebase/functions";
import "firebase/database";

var firebaseConfig = {
    apiKey: "AIzaSyA4-UL1g7qKXHKdY2GDlojtvQXFbSHDzt8",
    authDomain: "uoft-space.firebaseapp.com",
    databaseURL: "https://uoft-space.firebaseio.com",
    projectId: "uoft-space",
    storageBucket: "gs://uoft-space.appspot.com",
    messagingSenderId: "79578504726",
    appId: "1:79578504726:web:5dce96e46ed17102615f37",
    measurementId: "G-YDJG9TF7NQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;