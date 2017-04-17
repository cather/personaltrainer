'use strict';
var Vector = require('node-vector');
module.change_code = 1;

function Exercise(exerciseName, duration){
  this.exerciseName = name;
  this.duration = duration;
};  

function WorkoutQueue (obj) {
  this.started = false;
  this.currentExercise = 0;
  this.workout = new Vector();
  for (var prop in obj) this[prop] = obj[prop];
}

WorkoutQueue.prototype.addExercise = function(exercise, duration) {
  return this.currentWorkout().push(new Exercise(exercise, duration));
};

WorkoutQueue.prototype.removeExercise = function(exercise) {
  for (var i = this.currentWorkout().begin(); i != this.currentWorkout().end(); ++i) {
    if (i->exerciseName == exercise) {
      this.currentWorkout().erase(i);
      break;
    }
  }
  return this.currentWorkout();
};

WorkoutQueue.prototype.clearExercises = function(exercise) {
  return this.currentWorkout().clear();
};

WorkoutQueue.prototype.getExercise = function(index) {
  // assumes no problem with index
    return  this.currentWorkout()[i];
};


WorkoutQueue.prototype.currentWorkout = function() {
  return this.workout;
};

module.exports = WorkoutQueue;