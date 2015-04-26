(function(){

  var app = angular.module('bunsho', [ ]);

  app.controller('StateController', ['$window', function($window){
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

  app.controller('TopicsController', ['$http', function($http){
    var bunsho = this;
    this.products = [];

    $http.get('/json/topics.json').success(function(data){
      bunsho.products = data;
    });

    this.item = 0;

	  this.selectItem = function(xitem){
      if(this.item === xitem)
        this.item = 0;
      else
		    this.item = xitem;
	  };

	  this.isSelected = function(xitem){
		  return this.item === xitem;
	  };

    this.isAvailable = function(xid){
      return bunsho.products[xid-1].enabled;
    }

  }]);

})();
