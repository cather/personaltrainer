'use strict';
var Skill = require('alexa-sdk');
var skillService = new Skill.app('personaltrainer');
var PersonalTrainerHelper = require("./personal_trainer_helper");
var PERSONAL_TRAINER_SESSION_KEY = "personal_trainer";
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).


var getWorkoutQueue = function(request) {
  var workoutQueueData = request.session(PERSONAL_TRAINER_SESSION_KEY);
  if (workoutQueueData === undefined) {
    workoutQueueData = {};
  }
  return new PersonalTrainerHelper(workoutQueueData);
};

var cancelIntentFunction = function(request, response) {
  response.say("Great workout, high five! Bye").shouldEndSession(true);
};

skillService.intent("AMAZON.CancelIntent", {}, cancelIntentFunction);
skillService.intent("AMAZON.StopIntent", {}, cancelIntentFunction);

skillService.launch(function(request, response) {
  var prompt = "Welcome to Personal Trainer."
    //+ "Say 'recite workouts' to hear the current plan," 
    + "say 'add workout for duration' to add an exercise to the circuit"
    + "or say 'start' to get going!";
  response.say(prompt).shouldEndSession(false);
});

skillService.intent("StartWorkoutIntent", {
    "utterances": [
        "{|start|lets} {|workout|go}",
        "whip me into shape"
        ]
    },
  function(request, response) {
    //response.card(madlibHelper.currentMadlib().title, completedMadlib);

    var workoutQueue = getWorkoutQueue(request);
    response.say("5...4...3...2...1...GO");

    var workout = workoutQueue.runWorkout();
    for (var i = 0; i < workout.size(); i++) {
        var exercise = getExercise(i);
        response.say("Starting " + exercise.exerciseName + " for " + exercise.duration).shouldEndSession(false);
        // play music
        setTimeout(exercise.duration);
    }

    response.say("Great workout!!!!!").shouldEndSession(true);
  });

skillService.intent("AddExerciseIntent", {
  "slots": { 
    [
    "ExerciseToAddName": "LIST_OF_EXERCISES",
    "ExerciseTimeDuration": "AMAZON.DURATION"
    ]
  },
  "utterances": 
    [
      "add {-|ExerciseToAddName} for {-|ExerciseTimeDuration}", 
      "add {-|ExerciseTimeDuration} {of|for} {-|ExerciseToAddName}" 
    ]
},
  function(request, response) {
    var exerciseName = request.slot("ExerciseToAddName");
    var exerciseDuration = request.slot("ExerciseTimeDuration");
    var workoutQueue = getWorkoutQueue(request);
    workoutQueue.started = true;
    if (exerciseName !== undefined && exerciseDuration !== undefined) {
      workoutQueue.addExercise(exerciseName, exerciseDuration);
    }
    else {
        response.reprompt("I didn't get that. Say 'add [exercise name] for [duration]'.");
      response.shouldEndSession(false);
    }
    response.session(PERSONAL_TRAINER_SESSION_KEY, personalTrainerHelper);
  }
);

skillService.intent("RemoveExerciseTypeIntent", {
    "slots": { 
        [
        "ExerciseToRemoveName": "LIST_OF_EXERCISES"
        ]
      },
      "utterances": 
        [
          "remove {-|ExerciseToRemoveName}",
          "take out {-|ExerciseToRemoveName}" 
        ]
    },
  function(request, response) {
    var exerciseName = request.slot("ExerciseToRemoveName");
    var workoutQueue = getWorkoutQueue(request);
    workoutQueue.started = true;
    if (exerciseName !== undefined) {
      workoutQueue.removeExercise(exerciseName);
    }
    else {
       response.reprompt("I didn't see that in the workout. Say 'remove [exercise name]' to remove an exercise in the queue.");
      response.shouldEndSession(false);
    }
    response.session(PERSONAL_TRAINER_SESSION_KEY, personalTrainerHelper);
  });

skillService.intent("RemoveAllExercisesIntent", {    
    "utterances": [
        "{remove all|clear} workouts"
        ]
    },
  function(request, response) {
    response.say("Clearing the workout queue").shouldEndSession(false);
  });

skillService.intent("ReciteWorkoutIntent", {    
    "utterances": [
        "{read back the|recite} workouts",
        "{what|whats} {the|are we} {plan|doing} {|today}"
        ]
    },
  function(request, response) {
    response.say("Here's the plan: ").shouldEndSession(false);
    for (var i = 0; i < workout.size(); i++) {
        var exercise = getExercise(i);
        response.say(exercise.exerciseName + " for " + exercise.duration + ".").shouldEndSession(false);
    }
  });

module.exports = skillService;