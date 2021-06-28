import firebase from 'firebase';

// firebase initialization
const firebaseConfig = {
    apiKey: "AIzaSyBnH2KMY2u_4i8qx4t2O1ftkKHwMh213nU",
    authDomain: "cricketable-c1bac.firebaseapp.com",
    projectId: "cricketable-c1bac",
    storageBucket: "cricketable-c1bac.appspot.com",
    messagingSenderId: "623870164738",
    appId: "1:623870164738:web:abfaa548ef59e4ac114c1b",
    measurementId: "G-BPD1KRLP64"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

module.exports = db;