angular.module('bunsho').controller('StateController', ['$window', function($window){
  this.state = 0;
  /* 0    course list
     1    prelesson page
     2    lesson
     3    results page */

  this.lesson = 0;
  this.nofquestions = 0;
  this.questionsanswered = 0;
  this.barwidth = 0;

  this.isState = function(xstate){
    return this.state === xstate;
  };

  this.setLesson = function(xlesson){
    window.scrollTo(0, 0);
    this.lesson = xlesson;
    this.state = 1;
  };

  this.nextState = function(){
    window.scrollTo(0, 0);
    this.questionsanswered = 0;
    this.barwidth = 0;
    if(this.state === 3)
      this.state = 0;
    else
      this.state++;
  };

  this.nextQuestion = function(){

    /* validation and shit */

    $window.scrollTo(0, 0);
    this.questionsanswered++;
    this.barwidth = 100 * (this.questionsanswered / this.nofquestions);
    if(this.questionsanswered === this.nofquestions){
      this.barwidth = 0;
      this.nextState();
    }
  }
}]);
