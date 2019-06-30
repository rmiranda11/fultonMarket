// Firebase App (the core Firebase SDK) is always required and must be listed first
// import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
// import "firebase/auth";
// import "firebase/database";

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// // TODO: Replace the following with your app's Firebase project configuration
// const firebaseConfig = {
//   // ...
// };

// // Setting up port and requiring models for syncing
// var PORT = process.env.PORT || 8080;
// var db = require("./models");

// // Creating express app and configuring middleware needed for authentication
// var app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static("public"));
// // We need to use sessions to keep track of our user's login status
// app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());

// // Requiring our routes
// require("./routes/html-routes.js")(app);
// require("./routes/api-routes.js")(app);

// // Syncing our database and logging a message to the user upon success
// db.sequelize.sync().then(function () {
//   app.listen(PORT, function () {
//     console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
//   });
// });

var colors = new Array(
  [86, 125, 57], //green
  [155, 36, 27], // brick red
  // [72,144,168], // light blue 
  // [70,4,124], //purple
  [219, 149, 19],
  [9, 87, 160] //brown
);
var step = 0;
//color table indices for: 
// current color left
// next color left
// current color right
// next color right
var colorIndices = [0, 1, 2, 3];

//transition speed
var gradientSpeed = 0.002;

function updateGradient() {

  if ($ === undefined) return;

  var c0_0 = colors[colorIndices[0]];
  var c0_1 = colors[colorIndices[1]];
  var c1_0 = colors[colorIndices[2]];
  var c1_1 = colors[colorIndices[3]];

  var istep = 1 - step;
  var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
  var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
  var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
  var color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

  var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
  var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
  var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
  var color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

  $('#gradient').css({
    background: "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color2 + "))"
  }).css({
    background: "-moz-linear-gradient(left, " + color1 + " 0%, " + color2 + " 100%)"
  });

  step += gradientSpeed;
  if (step >= 1) {
    step %= 1;
    colorIndices[0] = colorIndices[1];
    colorIndices[2] = colorIndices[3];

    //pick two new target color indices
    //do not pick the same as the current one
    colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
    colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;

  }
}

setInterval(updateGradient, 10);


////////////////////////////////////////////////////////////
///////////////////  Form //////////////////////////////////
///////////////////////////////////////////////////////////


$(function () {
  function after_form_submitted(data) {
    if (data.result == 'success') {
      $('form#reused_form').hide();
      $('#success_message').show();
      $('#error_message').hide();
    }
    else {
      $('#error_message').append('<ul></ul>');

      jQuery.each(data.errors, function (key, val) {
        $('#error_message ul').append('<li>' + key + ':' + val + '</li>');
      });
      $('#success_message').hide();
      $('#error_message').show();

      //reverse the response on the button
      $('button[type="button"]', $form).each(function () {
        $btn = $(this);
        label = $btn.prop('orig_label');
        if (label) {
          $btn.prop('type', 'submit');
          $btn.text(label);
          $btn.prop('orig_label', '');
        }
      });

    }//else
  }

  $('#reused_form').submit(function (e) {
    e.preventDefault();

    $form = $(this);
    //show some response on the button
    $('button[type="submit"]', $form).each(function () {
      $btn = $(this);
      $btn.prop('type', 'button');
      $btn.prop('orig_label', $btn.text());
      $btn.text('Sending ...');
    });


    $.ajax({
      type: "POST",
      url: 'handler.php',
      data: $form.serialize(),
      success: after_form_submitted,
      dataType: 'json'
    });

  });
});

/////////////////////////////////////
////////// Nav Bar ////////////////



$( "#link1" ).click(function() {
  $( "#home" ).show(300);
  $( "#about" ).hide();
  $("#contact").hide();
  $("#footer").show();
  $("#menu").hide();

});

$( "#link2" ).click(function() {
  $( "#about" ).show(300);
    $( "#home" ).hide();
    $("#contact").hide();
    $("#footer").show();
    $("#menu").hide();
});

$( ".link3" ).click(function() {
  $( "#menu" ).show(300);
    $( "#home" ).hide();
    $("#contact").hide();
    $("#footer").show();
    $("#about").hide();
});

$( ".link4" ).click(function() {
  $( "#contact" ).show(300);
  $( "#home" ).hide();
  $("#about").hide();
  $("#menu").hide();
  $(".footer").hide();


});

$(window).resize(function(){
	if ($(window).width() <= 600){	
    // do something here
    $(".openTable").hide();
    $(".openTable2").show();
  }	
  else $(".openTable").show();
  $(".openTable2").hide();
  
});

///////////// Nav end //////////////////
////////////////////////////////////////




