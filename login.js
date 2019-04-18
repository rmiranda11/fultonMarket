var config = {
    apiKey: "AIzaSyD2HRtYIr8xlL7GSbhkiSModo8ngCbFCpE",
    authDomain: "fultonmarketco-bf129.firebaseapp.com",
    databaseURL: "https://fultonmarketco-bf129.firebaseio.com",
    projectId: "fultonmarketco-bf129",
    storageBucket: "fultonmarketco-bf129.appspot.com",
    messagingSenderId: "980423171597"
};
firebase.initializeApp(config);

$("#signin").on("click", () => {
    const email = $("#username").val();
    const pass = $("#password").val();
    const auth = firebase.auth();
    $(".errorText").empty()
    //If statement to validate user input
    if (email.includes("@") && email.includes(".") && pass.length > 5) {
        console.log("valid")
        //Sign in
        const promise = auth.signInWithEmailAndPassword(email, pass);
        //If error, log it to the console
        promise.catch(e => $(".errorText").text("Please enter a valid email/password"));
        //TODO: If error make it modolo instead of console logging it
        // clearInputForms();
        //If the validation wasn't correct
    } else {
        console.log("invalid")
    }
})