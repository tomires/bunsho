angular.module('bunsho').controller('TopicController', ['$http', function($http){
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
