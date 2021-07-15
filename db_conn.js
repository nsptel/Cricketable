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

// deleting unnecessary documents (template)
// db.collection('user').where('email', '==', "chintan024@gmail.com").get()
//     .then(function (querySnapshot) {
//         // Once we get the results, begin a batch
//         var batch = db.batch();

//         querySnapshot.forEach(function (doc) {
//             // For each doc, add a delete operation to the batch
//             batch.delete(doc.ref);
//         });

//         // Commit the batch
//         return batch.commit();
//     }).then(function () {
//         // Delete completed!
//         console.log("Deletion Successful.");
//     });

module.exports = db;