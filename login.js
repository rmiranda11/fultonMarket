var config = {
    apiKey: "AIzaSyD2HRtYIr8xlL7GSbhkiSModo8ngCbFCpE",
    authDomain: "fultonmarketco-bf129.firebaseapp.com",
    databaseURL: "https://fultonmarketco-bf129.firebaseio.com",
    projectId: "fultonmarketco-bf129",
    storageBucket: "fultonmarketco-bf129.appspot.com",
    messagingSenderId: "980423171597"
};
firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.firestore();
const database = firebase.database();

// listens for auth status changes
auth.onAuthStateChanged(user => {
    // console.log(user);
})

//logout method
const logout = document.querySelector('#logout');
logout.addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("signedout")
    })
})

// login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        // console.log(cred.user)
        loginForm.reset();
    })
})


// uploading images
const uploader = document.getElementById('uploader');
const fileButton = document.getElementById('fileButton');

fileButton.addEventListener('change', (e) => {
    //Get file
    let file = e.target.files[0];

    //create storage ref
    let storageRef = firebase.storage().ref('/events/' + file.name);

    //upload the file
    let task = storageRef.put(file)



    //update progress bar
    task.on('state_changed',

        function progress(snapshot) {
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.value = percentage
        },
        function error(err) {
            console.log(err)

        },
        function complete(snapshot) {
            // empty out the file uploaded

            //get url for pic
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log('File available at', downloadURL);
                // send the url to database


            });




        }

    )
})

//getdata
db.collection('/events/').get().then(snapshot => {
    // console.log(snapshot.docs[0]._document.proto.name)
    console.log(snapshot)
})

//delete images from storage