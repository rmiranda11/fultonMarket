var config = {
    apiKey: "AIzaSyD2HRtYIr8xlL7GSbhkiSModo8ngCbFCpE",
    authDomain: "fultonmarketco-bf129.firebaseapp.com",
    databaseURL: "https://fultonmarketco-bf129.firebaseio.com",
    projectId: "fultonmarketco-bf129",
    storageBucket: "fultonmarketco-bf129.appspot.com",
    messagingSenderId: "980423171597"
};
firebase.initializeApp(config);

// const auth = firebase.auth();
// const db = firebase.firestore();
const database = firebase.database();

var currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');


$("#Submit").on("click", function (event) {
    event.preventDefault();

    var nameInput = $("#nameInput").val();
    var emailInput = $("#emailInput").val();
    var messageInput = $("#messageInput").val();
    


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



    let newCard = (`
<div class="card" style="width: 26rem; margin:2.5rem;font-family:'Merriweather', 'Helvetica Neue', Arial, sans-serif;">
<button class=" card btn btn-danger xbutton d-flex justify-content-center" type="button" id="${key}" style="color:red; font-size:1rem; font-family:'Merriweather', 'Helvetica Neue', Arial, sans-serif;">Delete</button>
<div class="card-body">
    <h5 class="card-title">${nameInput}</h5>
    <p class="card-text">${emailInput}</p>
    <p class="card-text">${messageInput}</p>
    <p class="card-text" style="font-weight:bold;">${timeSlot}</p>
</div>
</div>`);

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

    // $(".card").hide();

    document.location.reload();


});


