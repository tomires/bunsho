(function(){

  var app = angular.module('bunsho', [ ]);

  app.controller('StateController', function(){
    this.state = 0;
    /* 0    course list
       1    prelesson page
       2    lesson
       3    results page */

    this.lesson = 0;

    this.isState = function(xstate){
      return this.state === xstate;
    };

    this.setLesson = function(xlesson){
      this.lesson = xlesson;
      this.state = 1;
    };

    this.nextState = function(){
      if(this.state === 3)
        this.state = 0;
      else
        this.state++;
    };

  });

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

  }]);

})();
