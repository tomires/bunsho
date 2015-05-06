/* handles work with individual questions */
angular.module('bunsho').controller('QuestionController', ['$http', '$scope', function($http, $scope){
  var bunsho = this; /* provides context to the HTTP getter */
  this.products = []; /* an array containing all the questions */
  this.alreadyAnswered = []; /* questions that have already been answered */
  this.currentQuestion = 0; /* number of the current question in the current lesson */
  this.userAnswer = ''; /* answer provided by the user, dynamically updated */
  this.results = []; /* an array containing question results in the current session */
  this.noCorrect; /* number of correct answers in the current session */
  this.noIncorrect; /* number of incorrect answers in the current session */
  this.revisionList = [];
  $scope.parsedQuestion = '<b>Connection error</b>'; /* question as it shows up on the page */
  $scope.resultsMeter = ' '; /* results display that shows up on the page */
  $scope.revisionWords = '';

  /* gets data from an appropriate json file */
  this.loadQuestions = function(lesson){
    $http.get('/json/' + lesson + '.json').success(function(data){
      bunsho.products = data;
      bunsho.results = [];
      bunsho.revisionList = [];
      $scope.resultsMeter = ' ';
      $scope.revisionWords = '';
      bunsho.randomQuestion();
    });
    return true;
  };

  /* gets us a random question */
  this.randomQuestion = function(){
    //while(this.alreadyAnswered.indexOf(this.currentQuestion) != -1)
      this.currentQuestion = parseInt(Math.random() * bunsho.products.length);
    //this.alreadyAnswered.push(this.currentQueestion);
    this.userAnswer = '';
    $scope.revisionWords = '';
    this.parseQuestion('en');
    return true;
  };

  /* prepares the text of a question for display */
  this.parseQuestion = function(lang){
    var questionText = '';

    if(lang == 'en')
      questionText = bunsho.products[this.currentQuestion].sentence_english;

    questionText = questionText.replace(/\[/g,'<span class="hint" ng-click="question.showHint(0)">');

    // replace with a for loop that assigns a number to each span

    questionText = questionText.replace(/\]/g,'</span>');

    this.redrawResults();

    $scope.parsedQuestion = questionText;
  };

  /* grabs a hint and pushes it into the revision list */
  this.grabHint = function(number){
    var hint = this.products[this.currentQuestion].dict[number].word;

    if(this.revisionList.indexOf(hint) == -1)
      this.revisionList.push(hint);

    return hint;
  };

  /* shows the hint on the page */
  this.showHint = function(number){
    var hint = this.grabHint(number);
    $scope.revisionWords = 'このことばは<b>' + hint + '</b>です。';
  };

  /* redraws the result indicator on the top of the question page */
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

  /* checking procedure that is called at the submission of the form*/
  this.checkAnswer = function(){
    if(bunsho.products.length == 0) return false;

    if(bunsho.products[this.currentQuestion].sentence_kana == this.userAnswer
    || bunsho.products[this.currentQuestion].sentence_romaji.replace(/ /g,'') == this.userAnswer.replace(/ /g,''))
      return true;
    else
      return false;
  };

  /* pushes an integer symbolizing a correct answer to the array */
  this.answerCorrect = function(){
    this.results.push(1);
    return true;
  };

  /* pushes an integer symbolizing a incorrect answer to the array */
  this.answerIncorrect = function(){
    this.results.push(0);
    return true;
  };

}]);
