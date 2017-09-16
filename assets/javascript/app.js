$(document).ready(function(){

//initialize Firebas
 var config = {
    apiKey: "AIzaSyBxvYMjY9nu_30Vt8lXL760Em8npJs4Z7o",
    authDomain: "train-schedule-a0afa.firebaseapp.com",
    databaseURL: "https://train-schedule-a0afa.firebaseio.com",
    projectId: "train-schedule-a0afa",
    storageBucket: "train-schedule-a0afa.appspot.com",
    messagingSenderId: "447903556777"
  };
  firebase.initializeApp(config);

  // Creating a variable to reference the firebase database.
    var database = firebase.database();

    $("#addTrainButton").on("click", function(){
    	event.preventDefault();
	   // Initial Values
	    var trainName = $("#trainName-input").val().trim();
	    var destination = $("#destination-input").val().trim();
	    var firstTrainInput = moment($("#firstTrain-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
	    var frequencyInput = $("#frequency-input").val().trim();
	    
	    console.log("Train name: " + trainName);
	    console.log("Destination: " + destination);
	    console.log("First Train: " + firstTrainInput);
	    console.log("Frequency: " + frequencyInput);

	database.ref().push({
	    	name: trainName,
	    	destination: destination,
	    	firstTrain: firstTrainInput,
	    	frequency: frequencyInput,
	    	timeAdded: firebase.database.ServerValue.TIMESTAMP
	    });

		//clearing text boxes
		//keeps page from refreshing 
		$("input").val("");
		return false;
    });

    database.ref().on("child_added", function(childSnapshot) {

    	console.log(childSnapshot.val());


		// assign firebase variables to snapshots.
		var name = childSnapshot.val().name;
		var destination = childSnapshot.val().destination;
		var time = childSnapshot.val().time;
		var frequency = childSnapshot.val().frequency;

		console.log("Name: " + name);
		console.log("Destination: " + destination);
		console.log("Time: " + time);
		console.log("Frequency: " + frequency);
	//console.log(moment().format("HH:mm"));

		var frequency = parseInt(frequency);
		
		var currentTime = moment();
		console.log("curent time: " + moment().format("HH:mm")); //works

		var trainTime = moment(time).format('HH:mm');
		console.log("TRAIN TIME : " + trainTime);
		
		//DIFFERENCE B/T THE TIMES 
		var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
		var tDifference = moment().diff(moment(tConverted), 'minutes');
		console.log("DIFFERENCE IN TIME: " + tDifference);
		//REMAINDER 
		var tRemainder = tDifference % frequency;
		console.log("TIME REMAINING: " + tRemainder);
		//MINUTES UNTIL NEXT TRAIN
		var minsAway = frequency - tRemainder;
		console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
		//NEXT TRAIN
		var nextTrain = moment().add(minsAway, 'minutes');
		console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));
		//console.log(==============================);
		

		//TABLE DATA=====================================================
		 //APPEND TO DISPLAY IN TRAIN TABLE
		$('#currentTime').text(currentTime);
		$('#trainTable').append(
				"<tr><td id='nameDisplay'>" + childSnapshot.val().name +
				"</td><td id='destDisplay'>" + childSnapshot.val().destination +
				"</td><td id='freqDisplay'>" + childSnapshot.val().frequency +
				"</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
				"</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
		 },

		function(errorObject){
		    console.log("Read failed: " + errorObject.code)
		});

		// database.ref().orderByChild("timeAdded").limitToLast(1).on("child_added", function(snapshot){
		//     // Change the HTML to reflect
		//     $("#nameDisplay").html(snapshot.val().name);
		//     $("#destDisplay").html(snapshot.val().dest);
		//     $("#timeDisplay").html(snapshot.val().time);
		//     $("#freqDisplay").html(snapshot.val().freq);
		// })

		}); //END DOCUMENT.READY