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
const uploader = $('#uploader');
const fileButton = $('#fileButton');


// listens for auth status changes
auth.onAuthStateChanged(user => {
    console.log("USER:", user);
    if (!user) {
        $("#adminpage").hide()
        $("#login").show()

    } else {
        $("#adminpage").show()
        $("#login").hide()
    }
})

//function that gets data from db and we append to carousel
const imgToCarousel = (data) => {
    //Create variable for the array of images
    const ImgArray = data.val();

    // Create variable to get ids for images
    let imageIds = Object.keys(data.val())

    // create element for each array of image properties
    const keys = Object.values(ImgArray)
    console.log("KEYS:", keys)

    let counter = 0
    keys.forEach(image => {
        //get the values we need in the object
        const array = Object.values(image);
        console.log(imageIds)

        //create variable for the name of image
        let imgName = array[0];
        //create variable for url of image
        let imgURL = array[1];
        console.log(imgName, imgURL)



        //create a div with properties need for caurosel item
        const CarouselItem = $("<div>", {
            "class": "carousel-item",
            "data-interval": "250"
        })

        //create variable for img tag, set source to image URL, id to image name (for now thats it)
        const imgTag = $("<img>", {
            "src": imgURL,
            "class": "img-responsive",
            "id": imgName
        });

        //append image to carosel item
        imgTag.appendTo(CarouselItem);

        //append carosuel div to carousel
        CarouselItem.appendTo(".carousel-inner")

        // creating a row to append our images so admin can see
        const rowForImgAdmin = $("<div>")
            .attr({
                "class": "row justify-content-right"
            })
        // making col to append to row 
        const colForImgAdmin = $("<div>")
            .attr({
                "class": "col-md-12"
            })

        //make delete button for image
        const delBtn = $("<button>")
            .attr({
                id: imageIds[counter],
                "class": "btn btn-danger delBtn"
            })

        delBtn.text("X")

        // append button to row div
        rowForImgAdmin.append(delBtn)

        // append the col to the row
        rowForImgAdmin.append(colForImgAdmin);

        // create a img tag for admin page
        const imgAdmin = $("<img>", {
            "src": imgURL,
            "class": "img-responsive img-thumbnail",
            "id": imgName
        });
        // append the image to the col
        colForImgAdmin.append(imgAdmin)


        console.log(CarouselItem, imgTag);
        console.log($(".carousel-inner"))

        // append the row to the admin page 
        $("#image-events").append(rowForImgAdmin)
        counter++
    })



}

// on click fucntion to delete images from database
$(document).on('click', ".delBtn", function (e) {

    let newKey = event.target.id
    console.log(event.target.id);


    var adaRef = firebase.database().ref('images/' + newKey);
    adaRef.remove();

    // $(this.id).hide();
    console.log(this.id)

    $(".card").hide();

    document.location.reload();


});

// logout method
const logout = $("#logout");
logout.on("click", (e) => {
    // e.preventDefault();              
    auth.signOut().then(() => {
        console.log("signed out")
        window.location.replace("/index.html")

    })
})


// login
const loginForm = $("#login-form");
loginForm.on("submit", (e) => {
    e.preventDefault();
    const email = $("#login-email").val();
    const password = $("#login-password").val();
    // console.log(email, password)

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        // console.log(cred.user)
        // loginForm.reset();
        console.log("signed in")
        window.location.replace("/admin.html")
        // window.location.href = "/admin.html"
        // location = "/admin.html"


    })
})

// admin page stuff


fileButton.on('change', (e) => {
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
function deleteImgFromCarousel(data) {

    let userRef = database.ref('images/' + data);
    userRef.remove()
};




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


$("#Submit").on("click", function (event) {
    event.preventDefault();

    var nameInput = $("#nameInput").val();
    var emailInput = $("#emailInput").val();
    var messageInput = $("#messageInput").val();
    var currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    console.log(currentTime);


    var newMessage = {
        name: {
            user: nameInput,
            email: emailInput,
            content: messageInput,
            time: currentTime
        }
    }

    console.log(newMessage);


    database.ref('Messages').push(newMessage);

    $("#nameInput").val(nameInput);
    $("#emailInput").val(emailInput);
    $("#messageInput").val(messageInput);



});


database.ref("Messages").on("child_added", function (childSnapshot) {
    // console.log(childSnapshot.val().key);

    var nameInput = childSnapshot.val().name.user;
    var emailInput = childSnapshot.val().name.email;
    var messageInput = childSnapshot.val().name.content;
    var timeSlot = childSnapshot.val().name.time;


    var key = childSnapshot.key;



    let newCard = (
        `<div class="card" style="width: 26rem; margin:2.5rem;font-family:'Merriweather', 'Helvetica Neue', Arial, sans-serif;">
            <button class="btn btn-danger xbutton d-flex justify-content-center" type="button" id="${key}" style="color:red; font-size:1rem; font-family:'Merriweather', 'Helvetica Neue', Arial, sans-serif;">Delete</button>
            <div class="card-body">
                <p class="card-title">${nameInput}</p>
                <p class="card-text">${emailInput}</p>
                <p class="card-text">${messageInput}</p>
                <p class="card-text" style="font-weight:bold;">${timeSlot}</p>
            </div>
        </div>`
    );

    $("#admin-row").append(newCard);




});


$(document).on('click', ".xbutton", function (e) {

    let newKey = event.target.id
    console.log(event.target.id);
    // let newKey = key.slice(1,19);
    // console.log(newKey);
    // database.child().remove(newKey);

    var adaRef = firebase.database().ref('Messages/' + newKey);
    adaRef.remove();

    // $(this.id).hide();
    console.log(this.id)

    $(".card").hide();

    document.location.reload();


});

//hide events section on initial load 
$("#events-admin").hide();

// on clicks to show messages and hide events
$("#eventBtn").on("click", function (e) {
    e.preventDefault();
    console.log("loaded")
    $("#events-admin").show();

    $("#messages-admin").hide()
});

$("#messagesBtn").on("click", function (e) {
    e.preventDefault();
    console.log("loaded")

    $("#messages-admin").show();

    $("#events-admin").hide()
});



