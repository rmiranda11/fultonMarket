var config = {
    apiKey: "AIzaSyD2HRtYIr8xlL7GSbhkiSModo8ngCbFCpE",
    authDomain: "fultonmarketco-bf129.firebaseapp.com",
    databaseURL: "https://fultonmarketco-bf129.firebaseio.com",
    projectId: "fultonmarketco-bf129",
    storageBucket: "fultonmarketco-bf129.appspot.com",
    messagingSenderId: "980423171597"
};
firebase.initializeApp(config);

//firebase variables
const auth = firebase.auth();
const firestore = firebase.firestore();
const database = firebase.database();

// uploading images
const uploader = document.getElementById('uploader');
const fileButton = document.getElementById('fileButton');

// listens for auth status changes
auth.onAuthStateChanged(user => {
    console.log("USER:", user);
})

//function that gets data from db and we try to append to carousel
const imgToCarousel = (data) => {
    //Create variable for the array of images
    const ImgArray = data.val();

    // create element for each array of image properties
    const keys = Object.values(ImgArray)
    console.log("KEYS:", keys)

    keys.forEach(image => {
        //get the values we need in the object
        const array = Object.values(image);
        // console.log(array)

        //create variable for the name of image
        imgName = array[0];
        //create variable for url of image
        imgURL = array[1];
        console.log(imgName, imgURL)
        // preview
        // < div class="carousel-item" data - interval="250" >
        //     <img src="./images/slideshow/Drinks_And_Meal.jpg" class="d-block w-100"
        //         alt="Drinks and Meal">
        // </div>


        //create a div with properties need for caurosel item
        const CarouselItem = $("<div>", {
            "class": "carousel-item",
            "data-interval": "250"
        })

        //create variable for img tag, set source to image URL, id to image name (for now thats it)
        const imgTag = $("<img>", {
            "src": imgURL,
            "class": "d-block w-100",
            "id": imgName
        });

        //append image to carosel item
        imgTag.appendTo(CarouselItem);
        console.log(CarouselItem, imgTag);

        //append carosuel div to carousel
        CarouselItem.appendTo(".carousel-inner")
        console.log($(".carousel-inner"))



        // append to div for testability
        // imgTag.appendTo($("#object"))
    })



}

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
        console.log("signed in")
    })
})


// admin page stuff

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
            console.log("ERR:", err)

        },
        function complete() {
            // empty out the file uploaded
            uploader.value = 0;

            //get url for pic
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log('File available at', downloadURL);

                // send the url to database
                const imgRef = database.ref("images");
                const result = imgRef.push({
                    name: task.snapshot.metadata.name,
                    url: downloadURL
                });
                console.log("RESULTS:", result)



            });




        }

    )
})

//getdata   DONT THINK WE NEED THIS DOUBLE CHECK
firestore.collection('/events/').get().then(snapshot => {
    // console.log(snapshot.docs[0]._document.proto.name)
    // console.log("SNAPSHOT:", snapshot)
})

//delete images from storage




//get data from database to push to cards

//element from page
const divObj = document.getElementById("object");

//create reference
const dbRef = database.ref().child("images");

//sync object changes
dbRef.on("value", snapshot => {
    //function to get images to carousel
    imgToCarousel(snapshot)

    console.log(snapshot.val())
});



