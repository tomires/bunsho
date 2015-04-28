(function(){

  var app = angular.module('bunsho', ['ngSanitize']);

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

  app.controller('QuestionController', ['$http', '$scope', function($http, $scope){
    var bunsho = this;
    this.products = [];
    this.alreadyAnswered = [];
    this.currentQuestion = 0;
    this.userAnswer = '';
    this.results = [];
    this.noCorrect;
    this.noIncorrect;
    $scope.parsedQuestion = '<b>ullshit</b>';
    $scope.resultsMeter = ' ';

    this.loadQuestions = function(lesson){
      $http.get('/json/' + lesson + '.json').success(function(data){
        bunsho.products = data;
        bunsho.results = [];
        $scope.resultsMeter = ' ';
        bunsho.randomQuestion();
      });
      return true;
    };

    this.randomQuestion = function(){
      //while(this.alreadyAnswered.indexOf(this.currentQuestion) != -1)
        this.currentQuestion = parseInt(Math.random() * bunsho.products.length);
      //this.alreadyAnswered.push(this.currentQueestion);
      this.userAnswer = '';
      this.parseQuestion('en');
      return true;
    };

    this.parseQuestion = function(lang){
      var questionText = '';

      if(lang == 'en')
        questionText = bunsho.products[this.currentQuestion].sentence_english;

      questionText = questionText.replace(/\[/g,'<span class="hint">');
      questionText = questionText.replace(/\]/g,'</span>');

      this.redrawResults();

      $scope.parsedQuestion = questionText;
    };

    this.redrawResults = function(){
      var tempResults = '';
      this.noCorrect = 0;
      this.noIncorrect = 0;
      
      if(this.results.length == 0) return;

      for(var result in this.results){
        if(this.results[result] == 1){
          tempResults += '1';
          this.noCorrect += 1;
        }
        else if(this.results[result] == 0){
          tempResults += '5';
          this.noIncorrect += 1;
        }
        // add a third result type
      }

      if(tempResults.length > 5)
        tempResults = tempResults.substr(tempResults.length - 5)

      $scope.resultsMeter = tempResults;
    };

    this.checkAnswer = function(){
      if(bunsho.products.length == 0) return false;

      if(bunsho.products[this.currentQuestion].sentence_kana == this.userAnswer
      || bunsho.products[this.currentQuestion].sentence_romaji.replace(/ /g,'') == this.userAnswer.replace(/ /g,''))
        return true;
      else
        return false;
    };

    this.answerCorrect = function(){
      this.results.push(1);
      return true;
    };

    this.answerIncorrect = function(){
      this.results.push(0);
      return true;
    };

  }]);

})();
